import { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import { updateUserAvatar, updateUserCoverImage } from "../api/userService"
import Navbar from "../components/Navbar.jsx"

const fileInputClass =
    "w-full text-sm text-gray-700 border border-olive/30 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-terracotta file:text-white file:font-medium file:cursor-pointer hover:file:bg-plum"

const submitButtonClass =
    "w-full bg-linear-to-r from-terracotta to-plum text-white rounded-lg py-2 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"

const Settings = () => {
    const { user, setUser } = useAuth()

    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [avatarError, setAvatarError] = useState("")
    const [avatarSuccess, setAvatarSuccess] = useState("")

    const [coverFile, setCoverFile] = useState(null)
    const [coverLoading, setCoverLoading] = useState(false)
    const [coverError, setCoverError] = useState("")
    const [coverSuccess, setCoverSuccess] = useState("")

    const handleAvatarSubmit = async (e) => {
        e.preventDefault()
        if (!avatarFile) return

        setAvatarLoading(true)
        setAvatarError("")
        setAvatarSuccess("")
        try {
            const formData = new FormData()
            formData.append("avatar", avatarFile)
            const res = await updateUserAvatar(formData)
            setUser(res.data)
            setAvatarFile(null)
            setAvatarSuccess("Avatar updated successfully")
        } catch (err) {
            setAvatarError(err.response?.data?.message || "Failed to update avatar")
        } finally {
            setAvatarLoading(false)
        }
    }

    const handleCoverSubmit = async (e) => {
        e.preventDefault()
        if (!coverFile) return

        setCoverLoading(true)
        setCoverError("")
        setCoverSuccess("")
        try {
            const formData = new FormData()
            formData.append("coverImage", coverFile)
            const res = await updateUserCoverImage(formData)
            setUser(res.data)
            setCoverFile(null)
            setCoverSuccess("Cover image updated successfully")
        } catch (err) {
            setCoverError(err.response?.data?.message || "Failed to update cover image")
        } finally {
            setCoverLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-navy via-plum to-terracotta">
            <Navbar />
            <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
                <h1 className="text-2xl font-bold text-cream">Profile Settings</h1>

                <form
                    onSubmit={handleAvatarSubmit}
                    className="bg-white p-6 rounded-2xl shadow-xl space-y-4"
                >
                    <h2 className="text-lg font-bold text-navy">Avatar</h2>

                    {avatarError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                            {avatarError}
                        </p>
                    )}
                    {avatarSuccess && (
                        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
                            {avatarSuccess}
                        </p>
                    )}

                    <div className="flex items-center gap-4">
                        {user?.avatar && (
                            <img
                                src={user.avatar}
                                alt="Current avatar"
                                className="w-16 h-16 rounded-full object-cover ring-2 ring-cream shrink-0"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                            className={fileInputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!avatarFile || avatarLoading}
                        className={submitButtonClass}
                    >
                        {avatarLoading ? "Updating..." : "Update Avatar"}
                    </button>
                </form>

                <form
                    onSubmit={handleCoverSubmit}
                    className="bg-white p-6 rounded-2xl shadow-xl space-y-4"
                >
                    <h2 className="text-lg font-bold text-navy">Cover Image</h2>

                    {coverError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                            {coverError}
                        </p>
                    )}
                    {coverSuccess && (
                        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
                            {coverSuccess}
                        </p>
                    )}

                    {user?.coverImage && (
                        <img
                            src={user.coverImage}
                            alt="Current cover"
                            className="w-full h-24 object-cover rounded-lg"
                        />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        className={fileInputClass}
                    />

                    <button
                        type="submit"
                        disabled={!coverFile || coverLoading}
                        className={submitButtonClass}
                    >
                        {coverLoading ? "Updating..." : "Update Cover Image"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Settings
