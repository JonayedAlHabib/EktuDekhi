import axiosInstance from "./axios"

export const toggleSubscription = (channelId) =>
    axiosInstance.post(`/subscriptions/c/${channelId}`).then((res) => res.data)

export const getUserChannelSubscribers = (channelId) =>
    axiosInstance.get(`/subscriptions/c/${channelId}`).then((res) => res.data)

export const getSubscribedChannels = (subscriberId) =>
    axiosInstance.get(`/subscriptions/u/${subscriberId}`).then((res) => res.data)
