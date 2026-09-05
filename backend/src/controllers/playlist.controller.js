import mongoose from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler (async (req, res) =>{
    const {name, description} = req.body

    if(!name?.trim() || !description?.trim())
        throw new ApiError(400, "Name & description are required")

    const playList = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, playList, "Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler (async (req, res) =>{
    const {userId} = req.params
    const {page=1, limit=10} = req.query

    if(!(mongoose.Types.ObjectId.isValid(userId)))
        throw new ApiError(400, "Invalid user ID")

    const playlists = await Playlist.paginate(
        {owner: userId},
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: {createdAt: -1},
            populate: {path: 'owner', select: 'userName avatar'}
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlists, "Playlists fetched successfully")
    )
})

const getPlaylistById = asyncHandler (async (req, res) =>{
    const {playlistId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(playlistId)))
        throw new ApiError(400, "Invalid playlist ID")

    const playlist = await Playlist.findById(playlistId)
        .populate('owner', 'userName avatar')
        .populate({
            path: 'videos',
            select: 'title thumbnail duration views owner',
            populate: { path: 'owner', select: 'userName avatar' }
        })

    if(!playlist)
        throw new ApiError(404, "Playlist not found")

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler (async (req, res) =>{
    const {playlistId, videoId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(playlistId)))
        throw new ApiError(400, "Invalid playlist ID")

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
        throw new ApiError(404, "Playlist not found")

    if(playlist.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to update this playlist")

    const video = await Video.findById(videoId)

    if(!video)
        throw new ApiError(404, "Video not found")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } },
        { returnDocument: 'after' }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler (async (req, res) =>{
    const {playlistId, videoId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(playlistId)))
        throw new ApiError(400, "Invalid playlist ID")

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
        throw new ApiError(400, "Invalid video ID")

    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
        throw new ApiError(404, "Playlist not found")

    if(playlist.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to update this playlist")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { returnDocument: 'after' }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully")
    )
})

const deletePlaylist = asyncHandler (async (req, res) =>{
    const {playlistId} = req.params

    if(!(mongoose.Types.ObjectId.isValid(playlistId)))
        throw new ApiError(400, "Invalid playlist ID")

    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
        throw new ApiError(404, "Playlist not found")

    if(playlist.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to delete this playlist")

    await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist
}
