import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import Logo from "./Logo.jsx"

const navLinkClass =
    "relative text-sm text-cream/70 hover:text-cream transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-terracotta after:transition-all hover:after:w-full"

const Navbar = () => {
    const { user, logout } = useAuth()

    return (
        <header className="bg-linear-to-r from-navy via-navy to-slate shadow-lg sticky top-0 z-10">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-cream shrink-0">
                        <Logo className="h-8 w-8 ring-2 ring-terracotta/60" />
                        EktuDekhi
                    </Link>
                    <nav className="flex items-center gap-5">
                        <Link to="/upload" className={navLinkClass}>
                            Upload
                        </Link>
                        <Link to="/playlists" className={navLinkClass}>
                            Playlists
                        </Link>
                        <Link to="/dashboard" className={navLinkClass}>
                            Dashboard
                        </Link>
                        {user?.userName && (
                            <Link to={`/channel/${user.userName}`} className={navLinkClass}>
                                My Channel
                            </Link>
                        )}
                        <Link to="/settings" className={navLinkClass}>
                            Settings
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-cream/80 hidden sm:inline">
                        {user?.fullName || user?.userName}
                    </span>
                    <button
                        onClick={logout}
                        className="bg-linear-to-r from-terracotta to-plum text-cream rounded-lg px-4 py-1.5 text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar
