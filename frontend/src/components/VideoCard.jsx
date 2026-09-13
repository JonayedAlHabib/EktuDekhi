import { Link } from "react-router-dom"

const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return "--:--"
    const total = Math.floor(seconds)
    const mins = Math.floor(total / 60)
    const secs = total % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

const VideoCard = ({ video }) => {
    return (
        <Link
            to={`/watch/${video._id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
        >
            <div className="relative aspect-video bg-gray-200">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </span>
            </div>
            <div className="p-3 flex gap-3">
                {video.owner?.avatar && (
                    <img
                        src={video.owner.avatar}
                        alt={video.owner.userName}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                )}
                <div className="min-w-0">
                    <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{video.owner?.userName}</p>
                    <p className="text-xs text-gray-500">{video.views ?? 0} views</p>
                </div>
            </div>
        </Link>
    )
}

export default VideoCard
