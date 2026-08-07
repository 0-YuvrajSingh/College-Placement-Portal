import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get("/auth/me")
        setUser(data.data.user)
        localStorage.setItem("user", JSON.stringify(data.data.user))
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const storeSession = (token, user) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password })
    const { token, user } = data.data
    storeSession(token, user)
    return user
  }

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password })
    const { token, user } = data.data
    storeSession(token, user)
    return user
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
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
