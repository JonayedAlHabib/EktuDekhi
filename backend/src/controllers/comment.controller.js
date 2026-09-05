import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"

const getAllComments = asyncHandler (async (req, res) =>{
    const { videoId } = req.params
    const {page=1, limit=10} = req.query

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    const video = await Video.findById(videoId)

    if(!video)
        throw new ApiError(404, "Video not found")

    const comments = await Comment.paginate(
        { video: videoId },
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: { path: 'owner', select:'userName avatar' }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )
})

const addComment = asyncHandler (async (req, res) =>{
    const { videoId } = req.params
    const { content } = req.body

    if(!content?.trim())
        throw new ApiError(400, "Content is required")

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    const video = await Video.findById(videoId)

    if(!video)
        throw new ApiError(404, "Video not found")

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, comment, "Comment added successfully")
    )
})

const deleteComment = asyncHandler (async (req, res)=>{
    const { commentId } = req.params

    if(!(mongoose.Types.ObjectId.isValid(commentId)))
        throw new ApiError(400, "Invalid comment ID")

    const comment = await Comment.findById(commentId)

    if(!comment)
        throw new ApiError(404, "Comment not found")

    if(comment.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to delete this comment")

    await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    )
})

const updateComment = asyncHandler (async (req, res)=>{
    const { commentId } = req.params
    const { content } = req.body

    if(!content?.trim())
        throw new ApiError(400, "Content is required")

    if(!(mongoose.Types.ObjectId.isValid(commentId)))
        throw new ApiError(400, "Invalid comment ID")

    const comment = await Comment.findById(commentId)

    if(!comment)
        throw new ApiError(404, "Comment not found")

    if(comment.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to update this comment")

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content } },
        { returnDocument: 'after' }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )
})


export {
    getAllComments,
    addComment,
    deleteComment,
    updateComment
}
