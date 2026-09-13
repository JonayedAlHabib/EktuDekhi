import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../api/tweetService"
import Navbar from "../components/Navbar.jsx"

const TWEETS_PER_PAGE = 10

const Tweets = () => {
    const { user } = useAuth()
    const [tweets, setTweets] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [content, setContent] = useState("")
    const [posting, setPosting] = useState(false)

    const [editingId, setEditingId] = useState(null)
    const [editContent, setEditContent] = useState("")

    const fetchTweets = async () => {
        setLoading(true)
        setError("")
        try {
            const res = await getUserTweets(user._id, { page, limit: TWEETS_PER_PAGE })
            setTweets(res.data.docs)
            setTotalPages(res.data.totalPages || 1)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load tweets")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTweets()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const handlePost = async (e) => {
        e.preventDefault()
        if (!content.trim()) return

        setPosting(true)
        setError("")
        try {
            await createTweet(content.trim())
            setContent("")
            if (page === 1) {
                fetchTweets()
            } else {
                setPage(1)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post tweet")
        } finally {
            setPosting(false)
        }
    }

    const startEdit = (tweet) => {
        setEditingId(tweet._id)
        setEditContent(tweet.content)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditContent("")
    }

    const handleUpdate = async (tweetId) => {
        if (!editContent.trim()) return
        setError("")
        try {
            const res = await updateTweet(tweetId, editContent.trim())
            setTweets((prev) => prev.map((t) => (t._id === tweetId ? res.data : t)))
            cancelEdit()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update tweet")
        }
    }

    const handleDelete = async (tweetId) => {
        setError("")
        try {
            await deleteTweet(tweetId)
            setTweets((prev) => prev.filter((t) => t._id !== tweetId))
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete tweet")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <h1 className="text-xl font-semibold mb-4">My Tweets</h1>

                <form onSubmit={handlePost} className="bg-white p-4 rounded-lg shadow mb-6">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's happening?"
                        rows={3}
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={posting || !content.trim()}
                            className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {posting ? "Posting..." : "Tweet"}
                        </button>
                    </div>
                </form>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-4">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading tweets...</p>
                ) : tweets.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No tweets yet</p>
                ) : (
                    <ul className="space-y-3">
                        {tweets.map((tweet) => (
                            <li key={tweet._id} className="bg-white rounded-lg shadow p-4">
                                {editingId === tweet._id ? (
                                    <div>
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={2}
                                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={cancelEdit}
                                                className="text-sm text-gray-600 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(tweet._id)}
                                                disabled={!editContent.trim()}
                                                className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-sm text-gray-800 whitespace-pre-line">
                                            {tweet.content}
                                        </p>
                                        <div className="flex gap-2 shrink-0 text-xs">
                                            <button
                                                onClick={() => startEdit(tweet)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tweet._id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
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
            </div>
        </div>
    )
}

export default Tweets
