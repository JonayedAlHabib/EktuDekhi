import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(channelId)))
        throw new ApiError(400, "Invalid channel ID")

    if(channelId === req.user._id.toString())
        throw new ApiError(400, "You cannot subscribe to your own channel")

    const channel = await User.findById(channelId)

    if(!channel)
        throw new ApiError(404, "Channel not found")

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if(existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
        )
    }

    const subscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, { subscribed: true, subscription }, "Subscribed successfully")
    )
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(channelId)))
        throw new ApiError(400, "Invalid channel ID")

    const channel = await User.findById(channelId)

    if(!channel)
        throw new ApiError(404, "Channel not found")

    const subscribers = await Subscription.find({ channel: channelId })
        .sort({ createdAt: -1 })
        .populate('subscriber', 'userName avatar fullName')

    return res
    .status(200)
    .json(
        new ApiResponse(200, subscribers, "Channel subscribers fetched successfully")
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!(mongoose.Types.ObjectId.isValid(subscriberId)))
        throw new ApiError(400, "Invalid subscriber ID")

    const subscriber = await User.findById(subscriberId)

    if(!subscriber)
        throw new ApiError(404, "User not found")

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
        .sort({ createdAt: -1 })
        .populate('channel', 'userName avatar fullName')

    return res
    .status(200)
    .json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully")
    )
})

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
}
