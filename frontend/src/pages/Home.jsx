import { useAuth } from "../context/AuthContext.jsx"

const Home = () => {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
            <p className="text-lg">Welcome, {user?.fullName || user?.userName}</p>
            <button
                onClick={logout}
                className="bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-900"
            >
                Logout
            </button>
        </div>
    )
}

export default Home
