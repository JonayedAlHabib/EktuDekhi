import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser, logoutUser } from "../api/userService"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)

    // On app load, the httpOnly accessToken cookie may still be valid even though
    // React state was just reset by the page reload — try to restore the session
    // from it instead of forcing a fresh login every time.
    useEffect(() => {
        let cancelled = false

        const restoreSession = async () => {
            try {
                const res = await getCurrentUser()
                if (cancelled) return
                setUser(res.data)
            } catch {
                if (cancelled) return
                setUser(null)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        restoreSession()
        return () => {
            cancelled = true
        }
    }, [])

    const login = ({ user: loggedInUser, accessToken: token }) => {
        setUser(loggedInUser)
        setAccessToken(token)
    }

    const logout = async () => {
        try {
            await logoutUser()
        } catch {
            // even if the request fails, clear local state so the UI reflects logged-out
        }
        setUser(null)
        setAccessToken(null)
    }

    const value = {
        user,
        accessToken,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        setUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export default AuthContext
