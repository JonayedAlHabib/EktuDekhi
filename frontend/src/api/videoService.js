import axiosInstance from "./axios"

export const getAllVideos = (params) =>
    axiosInstance.get("/videos", { params }).then((res) => res.data)

export const uploadVideo = (formData) =>
    axiosInstance.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((res) => res.data)

export const getVideoById = (videoId) =>
    axiosInstance.get(`/videos/${videoId}`).then((res) => res.data)

export const updateVideo = (videoId, formData) =>
    axiosInstance.patch(`/videos/${videoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((res) => res.data)

export const deleteVideo = (videoId) =>
    axiosInstance.delete(`/videos/${videoId}`).then((res) => res.data)

export const togglePublishStatus = (videoId) =>
    axiosInstance.patch(`/videos/toggle/publish/${videoId}`).then((res) => res.data)
