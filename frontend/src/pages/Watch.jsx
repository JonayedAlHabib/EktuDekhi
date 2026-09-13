import { useEffect, useState } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { getVideoById } from "../api/videoService"
import { toggleVideoLike, getAllLikedVideos } from "../api/likeService"
import CommentSection from "../components/CommentSection.jsx"

const Watch = () => {
    const { videoId } = useParams()
    const location = useLocation()

    const [video, setVideo] = useState(location.state?.video || null)
    const [loadingVideo, setLoadingVideo] = useState(!location.state?.video)
    const [videoError, setVideoError] = useState("")

    const [liked, setLiked] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)

    // Skip the fetch when a VideoCard already handed us the video via router state;
    // otherwise (direct URL visit / refresh) fetch it by id.
    useEffect(() => {
        if (video) return
        let cancelled = false

        const fetchVideo = async () => {
            setLoadingVideo(true)
            setVideoError("")
            try {
                const res = await getVideoById(videoId)
                if (cancelled) return
                setVideo(res.data)
            } catch (err) {
                if (cancelled) return
                setVideoError(err.response?.data?.message || "Failed to load video")
            } finally {
                if (!cancelled) setLoadingVideo(false)
            }
        }

        fetchVideo()
        return () => {
            cancelled = true
        }
    }, [video, videoId])

    // Determine initial like state from the current user's liked-videos list.
    useEffect(() => {
        let cancelled = false

        const fetchLikeStatus = async () => {
            try {
                const res = await getAllLikedVideos()
                if (cancelled) return
                setLiked(res.data.some((like) => like.video?._id === videoId))
            } catch {
                // non-critical — leave `liked` as false if this fails
            }
        }

        fetchLikeStatus()
        return () => {
            cancelled = true
        }
    }, [videoId])

    const handleToggleLike = async () => {
        setLikeLoading(true)
        try {
            const res = await toggleVideoLike(videoId)
            setLiked(res.data.liked)
        } catch {
            // ignore — button just won't toggle if the call fails
        } finally {
            setLikeLoading(false)
        }
    }

    if (loadingVideo) {
        return <p className="text-center text-gray-500 py-12">Loading video...</p>
    }

    if (videoError || !video) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-3">{videoError || "Video not found"}</p>
                <Link to="/" className="text-blue-600 hover:underline">
                    Back to home
                </Link>
            </div>
        )
    }

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
                <div className="flex items-center gap-3">
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
                        <p className="text-xs text-gray-500">{video.views ?? 0} views</p>
                    </div>
                </div>

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

            <p className="text-sm text-gray-700 mt-4 whitespace-pre-line">
                {video.description}
            </p>

            <CommentSection videoId={videoId} />
        </div>
    )
}

export default Watch
