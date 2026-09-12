import axiosInstance from "./axios"

export const getHealth = () =>
    axiosInstance.get("/healthcheck").then((res) => res.data)
