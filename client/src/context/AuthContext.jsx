import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'  // ✅ Named import untuk v4+
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)  // ✅ Gunakan jwtDecode, bukan jwt_decode
        setUser(decoded)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    const decoded = jwtDecode(data.token)  // ✅ Perbaiki di sini juga
    setUser(decoded)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    return decoded
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    const decoded = jwtDecode(data.token)  // ✅ Perbaiki di sini juga
    setUser(decoded)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    return decoded
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)