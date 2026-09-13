import { useEffect, useState } from "react"
import { getChannelStats } from "../api/dashboardService"
import Navbar from "../components/Navbar.jsx"

const StatCard = ({ label, value }) => (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-terracotta to-plum" />
        <p className="text-3xl font-bold bg-linear-to-r from-navy to-terracotta bg-clip-text text-transparent">
            {value}
        </p>
        <p className="text-sm text-olive mt-1">{label}</p>
    </div>
)

const Dashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let cancelled = false

        const fetchStats = async () => {
            setLoading(true)
            setError("")
            try {
                const res = await getChannelStats()
                if (cancelled) return
                setStats(res.data)
            } catch (err) {
                if (cancelled) return
                setError(err.response?.data?.message || "Failed to load stats")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchStats()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <div className="min-h-screen bg-linear-to-br from-navy via-plum to-terracotta">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-6">
                <h1 className="text-xl font-bold text-cream mb-4">Dashboard</h1>

                {loading ? (
                    <p className="text-center text-cream/70 py-8">Loading stats...</p>
                ) : error ? (
                    <p className="text-center text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard label="Total Videos" value={stats.totalVideos} />
                        <StatCard label="Total Views" value={stats.totalViews} />
                        <StatCard label="Subscribers" value={stats.totalSubscribers} />
                        <StatCard label="Total Likes" value={stats.totalLikes} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
