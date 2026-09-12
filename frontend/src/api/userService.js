import axiosInstance from "./axios"

export const registerUser = (formData) =>
    axiosInstance.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((res) => res.data)

export const loginUser = ({ userName, email, password }) =>
    axiosInstance.post("/users/login", { userName, email, password })
        .then((res) => res.data)

export const logoutUser = () =>
    axiosInstance.post("/users/logout").then((res) => res.data)

export const refreshAccessToken = () =>
    axiosInstance.post("/users/refresh-token").then((res) => res.data)

export const changePassword = ({ oldPassword, newPassword }) =>
    axiosInstance.patch("/users/change-password", { oldPassword, newPassword })
        .then((res) => res.data)

export const getCurrentUser = () =>
    axiosInstance.get("/users/get-user").then((res) => res.data)

export const updateAccountDetails = ({ fullName, email }) =>
    axiosInstance.patch("/users/update-account", { fullName, email })
        .then((res) => res.data)

export const updateUserAvatar = (formData) =>
    axiosInstance.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((res) => res.data)

export const updateUserCoverImage = (formData) =>
    axiosInstance.patch("/users/cover-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((res) => res.data)

export const getUserChannelProfile = (username) =>
    axiosInstance.get(`/users/c/${username}`).then((res) => res.data)

export const getWatchHistory = () =>
    axiosInstance.get("/users/watchHistory").then((res) => res.data)
