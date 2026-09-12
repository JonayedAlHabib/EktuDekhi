import axiosInstance from "./axios"

export const getAllComments = (videoId, params) =>
    axiosInstance.get(`/comments/${videoId}`, { params }).then((res) => res.data)

export const addComment = (videoId, content) =>
    axiosInstance.post(`/comments/${videoId}`, { content }).then((res) => res.data)

export const updateComment = (commentId, content) =>
    axiosInstance.patch(`/comments/c/${commentId}`, { content }).then((res) => res.data)

export const deleteComment = (commentId) =>
    axiosInstance.delete(`/comments/c/${commentId}`).then((res) => res.data)
