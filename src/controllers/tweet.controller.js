import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Tweet } from "../models/tweet.model.js"

const createTweet = asyncHandler (async (req, res) =>{
    const { content } = req.body

    if(!content?.trim())
        throw new ApiError(400, "Content is required")

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    )
})

const getUserTweets = asyncHandler (async (req, res) =>{
    const { userId } = req.params
    const {page=1, limit=10} = req.query

    if(!(mongoose.Types.ObjectId.isValid(userId)))
        throw new ApiError(400, "Invalid user ID")

    const tweets = await Tweet.paginate(
        { owner: userId },
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: { path: 'owner', select: 'userName avatar' }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    )
})

const updateTweet = asyncHandler (async (req, res) =>{
    const { tweetId } = req.params
    const { content } = req.body

    if(!content?.trim())
        throw new ApiError(400, "Content is required")

    if(!(mongoose.Types.ObjectId.isValid(tweetId)))
        throw new ApiError(400, "Invalid tweet ID")

    const tweet = await Tweet.findById(tweetId)

    if(!tweet)
        throw new ApiError(404, "Tweet not found")

    if(tweet.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to update this tweet")

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content } },
        { returnDocument: 'after' }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler (async (req, res) =>{
    const { tweetId } = req.params

    if(!(mongoose.Types.ObjectId.isValid(tweetId)))
        throw new ApiError(400, "Invalid tweet ID")

    const tweet = await Tweet.findById(tweetId)

    if(!tweet)
        throw new ApiError(404, "Tweet not found")

    if(tweet.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to delete this tweet")

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
