import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id

    const totalVideos = await Video.countDocuments({ owner: channelId })

    const viewsResult = await Video.aggregate([
        { $match: { owner: channelId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])
    const totalViews = viewsResult[0]?.totalViews || 0

    const totalSubscribers = await Subscription.countDocuments({ channel: channelId })

    const videoIds = await Video.find({ owner: channelId }).distinct('_id')
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } })

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
        }, "Channel stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const {page=1, limit=10} = req.query

    const videos = await Video.paginate(
        { owner: req.user._id },
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
}