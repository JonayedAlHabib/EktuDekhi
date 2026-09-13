import { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getVideoById } from "../api/videoService"
import { toggleVideoLike, getAllLikedVideos } from "../api/likeService"
import { getUserChannelProfile } from "../api/userService"
import { toggleSubscription } from "../api/subscriptionService"
import { useAuth } from "../context/AuthContext.jsx"
import CommentSection from "../components/CommentSection.jsx"

const Watch = () => {
    const { videoId } = useParams()
    const { user: currentUser } = useAuth()

    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [liked, setLiked] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)

    const [subInfo, setSubInfo] = useState(null)
    const [subLoading, setSubLoading] = useState(false)

    // fetchedForRef stops React StrictMode's dev-only double-invoke of this effect from
    // sending the request twice — GET /videos/:videoId also increments the view count
    // server-side, so a double-fire would double-count the view.
    const fetchedForRef = useRef(null)
    useEffect(() => {
        if (fetchedForRef.current === videoId) return
        fetchedForRef.current = videoId

        setLoading(true)
        getVideoById(videoId)
            .then((res) => setVideo(res.data))
            .catch((err) => setError(err.response?.data?.message || "Failed to load video"))
            .finally(() => setLoading(false))
    }, [videoId])

    useEffect(() => {
        getAllLikedVideos()
            .then((res) => setLiked(res.data.some((like) => like.video?._id === videoId)))
            .catch(() => {})
    }, [videoId])

    useEffect(() => {
        if (!video?.owner?.userName) return
        getUserChannelProfile(video.owner.userName)
            .then((res) =>
                setSubInfo({
                    isSubscribed: res.data.isSubscribed,
                    subscribersCount: res.data.subscribersCount
                })
            )
            .catch(() => {})
    }, [video?.owner?.userName])

    const handleToggleLike = async () => {
        setLikeLoading(true)
        try {
            const res = await toggleVideoLike(videoId)
            setLiked(res.data.liked)
            setVideo((prev) => ({
                ...prev,
                likesCount: prev.likesCount + (res.data.liked ? 1 : -1)
            }))
        } finally {
            setLikeLoading(false)
        }
    }

    const handleToggleSubscribe = async () => {
        setSubLoading(true)
        try {
            const res = await toggleSubscription(video.owner._id)
            setSubInfo((prev) => ({
                isSubscribed: res.data.subscribed,
                subscribersCount: prev.subscribersCount + (res.data.subscribed ? 1 : -1)
            }))
        } finally {
            setSubLoading(false)
        }
    }

    if (loading) {
        return <p className="text-center text-gray-500 py-12">Loading video...</p>
    }

    if (error || !video) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-3">{error || "Video not found"}</p>
                <Link to="/" className="text-blue-600 hover:underline">
                    Back to home
                </Link>
            </div>
        )
    }

    const isOwnVideo = currentUser?.userName === video.owner?.userName

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <Link to="/" className="text-sm text-blue-600 hover:underline">
                &larr; Back
            </Link>

            <video
                controls
                src={video.videoFile}
                poster={video.thumbnail}
                className="w-full rounded-lg bg-black aspect-video mt-3"
            />

            <h1 className="text-xl font-semibold mt-4">{video.title}</h1>

            <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
                <Link
                    to={`/channel/${video.owner?.userName}`}
                    className="flex items-center gap-3 hover:opacity-80"
                >
                    {video.owner?.avatar && (
                        <img
                            src={video.owner.avatar}
                            alt={video.owner.userName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <p className="font-medium">
                            {video.owner?.fullName || video.owner?.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {video.views} views
                            {subInfo && ` · ${subInfo.subscribersCount} subscribers`}
                            {` · ${video.likesCount} likes`}
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    {!isOwnVideo && (
                        <button
                            onClick={handleToggleSubscribe}
                            disabled={subLoading}
                            className={`px-4 py-2 rounded font-medium text-sm disabled:opacity-50 ${
                                subInfo?.isSubscribed
                                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                        >
                            {subInfo?.isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    )}

                    <button
                        onClick={handleToggleLike}
                        disabled={likeLoading}
                        className={`px-4 py-2 rounded font-medium text-sm disabled:opacity-50 ${
                            liked
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                        {liked ? "Liked" : "Like"}
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-700 mt-4 whitespace-pre-line">
                {video.description}
            </p>

            <CommentSection videoId={videoId} />
        </div>
    )
}

export default Watch
