import { useEffect, useState } from "react"
import { getAllComments, addComment } from "../api/commentService"

const CommentSection = ({ videoId }) => {
    const [comments, setComments] = useState([])
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [newComment, setNewComment] = useState("")
    const [posting, setPosting] = useState(false)

    useEffect(() => {
        let cancelled = false

        const fetchComments = async () => {
            setLoading(true)
            setError("")
            try {
                const res = await getAllComments(videoId, { page, limit: 10 })
                if (cancelled) return
                setComments((prev) => (page === 1 ? res.data.docs : [...prev, ...res.data.docs]))
                setHasNextPage(!!res.data.hasNextPage)
            } catch (err) {
                if (cancelled) return
                setError(err.response?.data?.message || "Failed to load comments")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchComments()
        return () => {
            cancelled = true
        }
    }, [videoId, page])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setPosting(true)
        setError("")
        try {
            const res = await addComment(videoId, newComment.trim())
            setComments((prev) => [res.data, ...prev])
            setNewComment("")
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post comment")
        } finally {
            setPosting(false)
        }
    }

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Comments</h2>

            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={posting || !newComment.trim()}
                    className="bg-blue-600 text-white text-sm rounded px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {posting ? "Posting..." : "Post"}
                </button>
            </form>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-3">
                    {error}
                </p>
            )}

            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li key={comment._id} className="flex gap-3">
                        {comment.owner?.avatar && (
                            <img
                                src={comment.owner.avatar}
                                alt={comment.owner.userName}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                        )}
                        <div>
                            <p className="text-sm font-medium">{comment.owner?.userName}</p>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {loading && (
                <p className="text-center text-sm text-gray-500 py-4">Loading comments...</p>
            )}

            {!loading && comments.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">
                    No comments yet. Be the first to comment.
                </p>
            )}

            {!loading && hasNextPage && (
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="w-full mt-3 text-sm text-blue-600 hover:underline"
                >
                    Load more comments
                </button>
            )}
        </div>
    )
}

export default CommentSection
