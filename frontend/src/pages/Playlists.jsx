import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist
} from "../api/playlistService"
import Navbar from "../components/Navbar.jsx"

const Playlists = () => {
    const { user } = useAuth()
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [form, setForm] = useState({ name: "", description: "" })
    const [creating, setCreating] = useState(false)

    const [expandedId, setExpandedId] = useState(null)
    const [expandedPlaylist, setExpandedPlaylist] = useState(null)
    const [expandedLoading, setExpandedLoading] = useState(false)
    const [videoIdInput, setVideoIdInput] = useState("")
    const [actionError, setActionError] = useState("")

    const fetchPlaylists = async () => {
        setLoading(true)
        setError("")
        try {
            const res = await getUserPlaylists(user._id)
            setPlaylists(res.data.docs)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load playlists")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPlaylists()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!form.name.trim() || !form.description.trim()) return

        setCreating(true)
        setError("")
        try {
            await createPlaylist(form)
            setForm({ name: "", description: "" })
            fetchPlaylists()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create playlist")
        } finally {
            setCreating(false)
        }
    }

    const openPlaylist = async (playlistId) => {
        if (expandedId === playlistId) {
            setExpandedId(null)
            setExpandedPlaylist(null)
            return
        }

        setExpandedId(playlistId)
        setExpandedPlaylist(null)
        setExpandedLoading(true)
        setActionError("")
        try {
            const res = await getPlaylistById(playlistId)
            setExpandedPlaylist(res.data)
        } catch (err) {
            setActionError(err.response?.data?.message || "Failed to load playlist")
        } finally {
            setExpandedLoading(false)
        }
    }

    const handleAddVideo = async (e) => {
        e.preventDefault()
        if (!videoIdInput.trim() || !expandedId) return

        setActionError("")
        try {
            const res = await addVideoToPlaylist(videoIdInput.trim(), expandedId)
            setExpandedPlaylist(res.data)
            setVideoIdInput("")
        } catch (err) {
            setActionError(err.response?.data?.message || "Failed to add video")
        }
    }

    const handleRemoveVideo = async (videoId) => {
        if (!expandedId) return

        setActionError("")
        try {
            const res = await removeVideoFromPlaylist(videoId, expandedId)
            setExpandedPlaylist(res.data)
        } catch (err) {
            setActionError(err.response?.data?.message || "Failed to remove video")
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-navy via-plum to-terracotta">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-6">
                <h1 className="text-xl font-bold text-cream mb-4">My Playlists</h1>

                <form
                    onSubmit={handleCreate}
                    className="bg-white p-4 rounded-xl shadow-md flex gap-2 flex-wrap mb-6"
                >
                    <input
                        type="text"
                        placeholder="Playlist name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="flex-1 min-w-[150px] border border-olive/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta transition-shadow"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="flex-1 min-w-[150px] border border-olive/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta transition-shadow"
                    />
                    <button
                        type="submit"
                        disabled={creating}
                        className="bg-linear-to-r from-terracotta to-plum text-white rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {creating ? "Creating..." : "Create"}
                    </button>
                </form>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-4">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-center text-cream/70 py-8">Loading playlists...</p>
                ) : playlists.length === 0 ? (
                    <p className="text-center text-cream/70 py-8">No playlists yet</p>
                ) : (
                    <ul className="space-y-3">
                        {playlists.map((playlist) => (
                            <li key={playlist._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => openPlaylist(playlist._id)}
                                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-navy truncate">{playlist.name}</p>
                                        <p className="text-xs text-olive truncate">
                                            {playlist.description}
                                        </p>
                                    </div>
                                    <span className="text-sm text-terracotta font-medium shrink-0">
                                        {expandedId === playlist._id ? "Hide" : "Manage"}
                                    </span>
                                </button>

                                {expandedId === playlist._id && (
                                    <div className="px-4 pb-4 border-t pt-3">
                                        {expandedLoading ? (
                                            <p className="text-sm text-gray-500">Loading...</p>
                                        ) : (
                                            <>
                                                {actionError && (
                                                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-3">
                                                        {actionError}
                                                    </p>
                                                )}

                                                <form
                                                    onSubmit={handleAddVideo}
                                                    className="flex gap-2 mb-3"
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Video ID to add"
                                                        value={videoIdInput}
                                                        onChange={(e) =>
                                                            setVideoIdInput(e.target.value)
                                                        }
                                                        className="flex-1 border border-olive/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta transition-shadow"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="bg-linear-to-r from-terracotta to-plum text-white rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                                    >
                                                        Add
                                                    </button>
                                                </form>

                                                {expandedPlaylist?.videos?.length ? (
                                                    <ul className="space-y-2">
                                                        {expandedPlaylist.videos.map((video) => (
                                                            <li
                                                                key={video._id}
                                                                className="flex items-center justify-between gap-3"
                                                            >
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <img
                                                                        src={video.thumbnail}
                                                                        alt={video.title}
                                                                        className="w-16 h-10 object-cover rounded shrink-0"
                                                                    />
                                                                    <span className="text-sm truncate">
                                                                        {video.title}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() =>
                                                                        handleRemoveVideo(video._id)
                                                                    }
                                                                    className="text-xs text-red-600 hover:underline shrink-0"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        No videos in this playlist
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Playlists
