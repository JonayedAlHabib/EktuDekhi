import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
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

const getVideoById = asyncHandler (async (req, res) =>{
    const {videoId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    const video = await Video.findById(videoId)
        .populate('owner', 'userName avatar fullName')

    if(!video)
        throw new ApiError(404, "Video not found")

    if(!(video.isPublished))
        throw new ApiError(404, "Video not available")

    // Only count a view the first time this user watches this video - repeat visits
    // (refreshes, rewatching later) must not keep incrementing the counter.
    // findOneAndUpdate's $ne condition + $push happens as one atomic operation, so two
    // concurrent requests from the same user can't both "win" and double-count a view.
    const firstWatch = await User.findOneAndUpdate(
        { _id: req.user._id, watchHistory: { $ne: video._id } },
        { $push: { watchHistory: video._id } }
    )

    if(firstWatch) {
        await Video.findByIdAndUpdate(video._id, { $inc: {views: 1} })
        video.views += 1
    }

    const likesCount = await Like.countDocuments({ video: video._id })

    return res
    .status(200)
    .set("Cache-Control", "no-store")
    .json(
        new ApiResponse(
            200,
            { ...video.toObject(), likesCount },
            "Video fetched successfully"
        )
    )
})

const updateVideo = asyncHandler (async (req, res) =>{
    const {videoId} = req.params
    const {title, description} = req.body
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    if(!title && !description && !thumbnailLocalPath)
        throw new ApiError(400, "Provide at least one field to update")

    const video = await Video.findById(videoId)
        .populate('owner', 'userName avatar fullName')

    if(!video)
        throw new ApiError(404, "Video not found")

    if(video.owner._id.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to update this video")

    const updateFields = {}
    if(title) updateFields.title = title
    if(description) updateFields.description = description

    if(thumbnailLocalPath) {
        const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnailFile?.url)
            throw new ApiError(400, "Error while uploading thumbnail")
        updateFields.thumbnail = thumbnailFile.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { returnDocument: 'after' }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )

    
})

const deleteVideo = asyncHandler (async (req, res) =>{
    const {videoId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    const video = await Video.findById(videoId)
        .populate('owner', 'userName avatar fullName')

    if(!video)
        throw new ApiError(404, "Video not found")

    if(video.owner._id.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to delete this video")

    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if(!deletedVideo)
        throw new ApiError(500, "Error while deleting video")

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )

})

const togglePublishStatus = asyncHandler (async (req, res) =>{
    const {videoId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    const video = await Video.findById(videoId)
        .populate('owner', 'userName avatar fullName')

    if(!video)
        throw new ApiError(404, "Video not found")

    if(video.owner._id.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to delete this video")

    const user = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {isPublished: !video.isPublished}
        },
        {returnDocument : 'after'}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Video publish status toggled successfully")
    )

})

export {
    getAllVideos,
    uploadVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}