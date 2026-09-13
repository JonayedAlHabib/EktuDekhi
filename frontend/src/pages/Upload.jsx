import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { uploadVideo } from "../api/videoService"
import Navbar from "../components/Navbar.jsx"

const Upload = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({ title: "", description: "", duration: "" })
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!videoFile || !thumbnail) {
            setError("Video file and thumbnail are both required")
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("title", form.title)
            formData.append("description", form.description)
            formData.append("duration", form.duration)
            formData.append("videoFile", videoFile)
            formData.append("thumbnail", thumbnail)

            await uploadVideo(formData)
            navigate("/", { replace: true })
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-lg mx-auto px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg shadow space-y-4"
                >
                    <h1 className="text-2xl font-semibold text-center">Upload Video</h1>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                            {error}
                        </p>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Duration (seconds)
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={form.duration}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Video File</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                            required
                            className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-blue-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            required
                            className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-blue-700"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Upload
