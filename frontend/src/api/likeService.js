import axiosInstance from "./axios"

export const toggleVideoLike = (videoId) =>
    axiosInstance.post(`/likes/toggle/v/${videoId}`).then((res) => res.data)

export const toggleCommentLike = (commentId) =>
    axiosInstance.post(`/likes/toggle/c/${commentId}`).then((res) => res.data)

export const toggleTweetLike = (tweetId) =>
    axiosInstance.post(`/likes/toggle/t/${tweetId}`).then((res) => res.data)

export const getAllLikedVideos = () =>
    axiosInstance.get("/likes/videos").then((res) => res.data)
