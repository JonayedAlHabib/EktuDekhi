import { useState } from "react"
import { registerUser, loginUser } from "../api/userService"
import { useAuth } from "../context/AuthContext.jsx"

const Register = () => {
    const { login } = useAuth()
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        userName: "",
        password: ""
    })
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!avatar) {
            setError("Avatar is required")
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("fullName", form.fullName)
            formData.append("email", form.email)
            formData.append("userName", form.userName)
            formData.append("password", form.password)
            formData.append("avatar", avatar)
            if (coverImage) formData.append("coverImage", coverImage)

            await registerUser(formData)

            const loginRes = await loginUser({
                userName: form.userName,
                email: form.email,
                password: form.password
            })
            login({ user: loginRes.data.user, accessToken: loginRes.data.accessToken })
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white p-8 rounded-lg shadow space-y-4"
        >
            <h1 className="text-2xl font-semibold text-center">Register</h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {error}
                    </p>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Avatar</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                        required
                        className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-blue-700"
                    />
                    {avatar && (
                        <p className="mt-1 text-xs text-gray-500">{avatar.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Cover Image (optional)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                        className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-blue-700"
                    />
                    {coverImage && (
                        <p className="mt-1 text-xs text-gray-500">{coverImage.name}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
        </form>
    )
}

export default Register
