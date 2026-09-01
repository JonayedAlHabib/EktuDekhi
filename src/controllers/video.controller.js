import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse.js";

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

export {
    getAllVideos
}