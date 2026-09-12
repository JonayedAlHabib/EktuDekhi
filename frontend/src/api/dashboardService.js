import axiosInstance from "./axios"

export const getChannelStats = () =>
    axiosInstance.get("/dashboard/stats").then((res) => res.data)

export const getChannelVideos = (params) =>
    axiosInstance.get("/dashboard/videos", { params }).then((res) => res.data)
