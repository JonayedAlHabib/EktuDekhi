import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Like } from "../models/like.model.js"

const toggleVideoLike = asyncHandler (async (req, res)=>{
    const {videoId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    const video = await Video.findById(videoId)

    if(!video)
        throw new ApiError(404, "Video not found")

    const existingLike = await Like.findOne({
        video: videoId,
        likeBy: req.user._id
    })

    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, { liked: false }, "Video unliked successfully")
        )
    }

    const like = await Like.create({
        video: videoId,
        likeBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, { liked: true, like }, "Video liked successfully")
    )
})

const toggleCommentLike = asyncHandler (async (req, res)=>{
    const {commentId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(commentId)))
        throw new ApiError(400, "Invalid comment ID")

    const comment = await Comment.findById(commentId)

    if(!comment)
        throw new ApiError(404, "Comment not found")

    const existingLike = await Like.findOne({
        comment: commentId,
        likeBy: req.user._id
    })

    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, { liked: false }, "Comment unliked successfully")
        )
    }

    const like = await Like.create({
        comment: commentId,
        likeBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, { liked: true, like }, "Comment liked successfully")
    )
})

const toggleTweetLike = asyncHandler (async (req, res)=>{
    const {tweetId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(tweetId)))
        throw new ApiError(400, "Invalid tweet ID")

    const tweet = await Tweet.findById(tweetId)

    if(!tweet)
        throw new ApiError(404, "Tweet not found")

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likeBy: req.user._id
    })

    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, { liked: false }, "Tweet unliked successfully")
        )
    }

    const like = await Like.create({
        tweet: tweetId,
        likeBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, { liked: true, like }, "Tweet liked successfully")
    )
})

const getAllLike = asyncHandler (async (req, res)=>{
    const likedVideos = await Like.find({
        likeBy: req.user._id,
        video: { $exists: true, $ne: null }
    })
    .sort({ createdAt: -1 })
    .populate({
        path: 'video',
        populate: { path: 'owner', select: 'userName avatar fullName' }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getAllLike
}
