import { useEffect, useState } from "react"
import { getAllVideos } from "../api/videoService"
import VideoCard from "../components/VideoCard.jsx"
import Navbar from "../components/Navbar.jsx"

const VIDEOS_PER_PAGE = 12

const Home = () => {
    const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let cancelled = false

        const fetchVideos = async () => {
            setLoading(true)
            setError("")
            try {
                // GET /videos requires a non-empty `query` param on the backend;
                // ".*" is used here to match every title when browsing (no search box yet).
                const res = await getAllVideos({ page, limit: VIDEOS_PER_PAGE, query: ".*" })
                if (cancelled) return
                setVideos(res.data.docs)
                setTotalPages(res.data.totalPages || 1)
            } catch (err) {
                if (cancelled) return
                setError(err.response?.data?.message || "Failed to load videos")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchVideos()
        return () => {
            cancelled = true
        }
    }, [page])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-6">
                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-center text-gray-500 py-12">Loading videos...</p>
                ) : videos.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No videos found</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="px-4 py-2 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            className="px-4 py-2 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Home
