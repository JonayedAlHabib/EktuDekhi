import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Navbar = () => {
    const { user, logout } = useAuth()

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
                <Link to="/" className="font-semibold text-lg">
                    EktuDekhi
                </Link>
                <Link to="/upload" className="text-sm text-gray-600 hover:text-gray-900">
                    Upload
                </Link>
                <Link to="/playlists" className="text-sm text-gray-600 hover:text-gray-900">
                    Playlists
                </Link>
                <Link to="/tweets" className="text-sm text-gray-600 hover:text-gray-900">
                    Tweets
                </Link>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                    Dashboard
                </Link>
                {user?.userName && (
                    <Link
                        to={`/channel/${user.userName}`}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        My Channel
                    </Link>
                )}
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:inline">
                    {user?.fullName || user?.userName}
                </span>
                <button
                    onClick={logout}
                    className="bg-gray-800 text-white rounded px-4 py-2 text-sm hover:bg-gray-900"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Navbar
