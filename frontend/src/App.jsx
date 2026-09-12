import { useState } from 'react'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { useAuth } from './context/AuthContext.jsx'

const App = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [view, setView] = useState('login')

  if (isAuthenticated) {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 py-8">
      {view === 'login' ? <Login /> : <Register />}
      <p className="text-center text-sm">
        {view === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setView('register')}
              className="text-blue-600 hover:underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setView('login')}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  )
}

export default App
