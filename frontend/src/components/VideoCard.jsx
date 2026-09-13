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
            className="group block bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
        >
            <div className="relative aspect-video bg-gray-200 overflow-hidden">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-1 right-1 bg-navy/90 text-cream text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </span>
            </div>
            <div className="p-3 flex gap-3">
                {video.owner?.avatar && (
                    <img
                        src={video.owner.avatar}
                        alt={video.owner.userName}
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-cream"
                    />
                )}
                <div className="min-w-0">
                    <h3 className="text-sm font-medium text-navy line-clamp-2 group-hover:text-terracotta transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-xs text-olive mt-1">{video.owner?.userName}</p>
                    <p className="text-xs text-olive">{video.views ?? 0} views</p>
                </div>
            </div>
        </Link>
    )
}

export default VideoCard
