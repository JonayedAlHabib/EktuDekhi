import axiosInstance from "./axios"

export const createTweet = (content) =>
    axiosInstance.post("/tweets", { content }).then((res) => res.data)

export const getUserTweets = (userId, params) =>
    axiosInstance.get(`/tweets/user/${userId}`, { params }).then((res) => res.data)

export const updateTweet = (tweetId, content) =>
    axiosInstance.patch(`/tweets/${tweetId}`, { content }).then((res) => res.data)

export const deleteTweet = (tweetId) =>
    axiosInstance.delete(`/tweets/${tweetId}`).then((res) => res.data)
