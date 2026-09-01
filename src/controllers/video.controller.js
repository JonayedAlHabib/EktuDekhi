import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const getAllVideos = asyncHandler (async (req, res) =>{
    const {page=1, limit=10, query, sortBy, sortType, userId} = req.query

    if(!query)
        throw new ApiError(400, "Query is required")

    const filter = {
        title: {$regex: query, $options: 'i'},
        isPublished: true
    }

   if(userId) filter.owner = userId

   const sortOptions = {}

   if(sortBy) {
        sortOptions[sortBy] = sortType === 'asc'? 1: -1
   }else{
        sortOptions.createdAt = -1
   }
    
   const videos = await Video.paginate(
    filter,
    {
        page:parseInt(page),
        limit: parseInt(limit),
        sort: sortOptions,
        populate: {path: 'owner', select: 'userName avatar'}
    }
   )

   return res
   .status(200)
   .json(
    new ApiResponse(200, videos, "Videos fetched successfully")
   )
})

const uploadVideo = asyncHandler (async (req, res) =>{
    const {title, description, duration} = req.body

    if(!title || !description || !duration)
        throw new ApiError(400, "Title, description and duration are required")

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if(!videoLocalPath)
        throw new ApiError(400, "Video file is required")
    
    if(!thumbnailLocalPath)
        throw new ApiError(400, "Thumbnail is required")

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile?.url)
        throw new ApiError(400, "Error while uploading video file")
    
    if(!thumbnail?.url)
        throw new ApiError(400, "Error while uploading thumbnail")

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user._id,
        title,
        description,
        duration: parseInt(duration)
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, video, "Video uploaded successfully")
    )

})

export {
    getAllVideos,
    uploadVideo
}