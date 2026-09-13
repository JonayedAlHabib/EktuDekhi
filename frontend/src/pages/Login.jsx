import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { loginUser } from "../api/userService"
import { useAuth } from "../context/AuthContext.jsx"
import Logo from "../components/Logo.jsx"

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [form, setForm] = useState({ userName: "", email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const res = await loginUser(form)
            login({ user: res.data.user, accessToken: res.data.accessToken })
            navigate(location.state?.from?.pathname || "/", { replace: true })
        } catch (err) {
            setError(err.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-linear-to-br from-navy via-plum to-terracotta py-8 px-4">
            <div className="p-3 rounded-2xl bg-cream/10 shadow-2xl shadow-terracotta/50">
                <Logo className="h-16 w-16" />
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white/95 backdrop-blur p-8 rounded-2xl shadow-2xl space-y-4"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold bg-linear-to-r from-navy to-terracotta bg-clip-text text-transparent">
                        Welcome back
                    </h1>
                    <p className="text-sm text-olive mt-1">Log in to keep watching</p>
                </div>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {error}
                    </p>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        required
                        className="w-full border border-olive/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta transition-shadow"
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
                        className="w-full border border-olive/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta transition-shadow"
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
                        className="w-full border border-olive/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta transition-shadow"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-terracotta to-plum text-white rounded-lg py-2.5 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="text-center text-sm text-cream">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-medium text-white hover:underline">
                    Register
                </Link>
            </p>
        </div>
    )
}

export default Login
