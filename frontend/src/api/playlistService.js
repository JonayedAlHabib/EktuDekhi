import axiosInstance from "./axios"

export const createPlaylist = ({ name, description }) =>
    axiosInstance.post("/playlists", { name, description }).then((res) => res.data)

export const getUserPlaylists = (userId, params) =>
    axiosInstance.get(`/playlists/user/${userId}`, { params }).then((res) => res.data)

export const getPlaylistById = (playlistId) =>
    axiosInstance.get(`/playlists/${playlistId}`).then((res) => res.data)

export const addVideoToPlaylist = (videoId, playlistId) =>
    axiosInstance.patch(`/playlists/add/${videoId}/${playlistId}`).then((res) => res.data)

export const removeVideoFromPlaylist = (videoId, playlistId) =>
    axiosInstance.patch(`/playlists/remove/${videoId}/${playlistId}`).then((res) => res.data)

export const deletePlaylist = (playlistId) =>
    axiosInstance.delete(`/playlists/${playlistId}`).then((res) => res.data)
