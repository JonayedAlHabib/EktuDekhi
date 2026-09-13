import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <p className="text-center text-gray-500 py-12">Loading...</p>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute
