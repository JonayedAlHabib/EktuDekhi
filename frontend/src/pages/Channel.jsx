import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getUserChannelProfile } from "../api/userService"
import { toggleSubscription } from "../api/subscriptionService"
import { getAllVideos } from "../api/videoService"
import { useAuth } from "../context/AuthContext.jsx"
import Navbar from "../components/Navbar.jsx"
import VideoCard from "../components/VideoCard.jsx"

const Channel = () => {
    const { username } = useParams()
    const { user: currentUser } = useAuth()

    const [channel, setChannel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [subLoading, setSubLoading] = useState(false)

    const [videos, setVideos] = useState([])
    const [videosLoading, setVideosLoading] = useState(true)
    const [videosError, setVideosError] = useState("")

    useEffect(() => {
        let cancelled = false

        const fetchChannel = async () => {
            setLoading(true)
            setError("")
            try {
                const res = await getUserChannelProfile(username)
                if (cancelled) return
                setChannel(res.data)
            } catch (err) {
                if (cancelled) return
                setError(err.response?.data?.message || "Failed to load channel")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchChannel()
        return () => {
            cancelled = true
        }
    }, [username])

    // Once we know the channel's user id, fetch the videos they've uploaded,
    // newest upload first.
    useEffect(() => {
        if (!channel?._id) return
        let cancelled = false

        const fetchVideos = async () => {
            setVideosLoading(true)
            setVideosError("")
            try {
                const res = await getAllVideos({
                    query: ".*",
                    userId: channel._id,
                    sortBy: "createdAt",
                    sortType: "desc",
                    limit: 24
                })
                if (cancelled) return
                setVideos(res.data.docs)
            } catch (err) {
                if (cancelled) return
                setVideosError(err.response?.data?.message || "Failed to load videos")
            } finally {
                if (!cancelled) setVideosLoading(false)
            }
        }

        fetchVideos()
        return () => {
            cancelled = true
        }
    }, [channel?._id])

    const handleToggleSubscribe = async () => {
        if (!channel) return
        setSubLoading(true)
        try {
            const res = await toggleSubscription(channel._id)
            setChannel((prev) => ({
                ...prev,
                isSubscribed: res.data.subscribed,
                subscribersCount: prev.subscribersCount + (res.data.subscribed ? 1 : -1)
            }))
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update subscription")
        } finally {
            setSubLoading(false)
        }
    }

    const isOwnChannel = currentUser?.userName === username

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {loading ? (
                <p className="text-center text-gray-500 py-12">Loading channel...</p>
            ) : error || !channel ? (
                <p className="text-center text-red-600 py-12">{error || "Channel not found"}</p>
            ) : (
                <div className="max-w-5xl mx-auto">
                    <div className="h-40 bg-gray-300">
                        {channel.coverImage && (
                            <img
                                src={channel.coverImage}
                                alt="cover"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="px-6 -mt-10 flex items-end gap-4 flex-wrap pb-6">
                        <img
                            src={channel.avatar}
                            alt={channel.userName}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white bg-white"
                        />
                        <div className="flex-1 flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h1 className="text-xl font-semibold">{channel.fullName}</h1>
                                <p className="text-sm text-gray-500">@{channel.userName}</p>
                                <p className="text-sm text-gray-500">
                                    {channel.subscribersCount} subscribers ·{" "}
                                    {channel.channelsSubscribedToCount} subscribed
                                </p>
                            </div>

                            {!isOwnChannel && (
                                <button
                                    onClick={handleToggleSubscribe}
                                    disabled={subLoading}
                                    className={`px-5 py-2 rounded font-medium text-sm disabled:opacity-50 ${
                                        channel.isSubscribed
                                            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 pb-8">
                        <h2 className="text-lg font-semibold mb-3">Videos</h2>

                        {videosError && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-3">
                                {videosError}
                            </p>
                        )}

                        {videosLoading ? (
                            <p className="text-center text-gray-500 py-8">Loading videos...</p>
                        ) : videos.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                No videos uploaded yet
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {videos.map((video) => (
                                    <VideoCard key={video._id} video={video} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Channel
