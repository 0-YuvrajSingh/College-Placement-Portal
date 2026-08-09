import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { TOKEN_KEY } from "@/lib/api"
import { authApi } from "@/api/auth"
import { ApiError } from "@/lib/api"
import type { RecruiterProfile, Role, StudentProfile, User } from "@/types"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  user: User | null
  profile: StudentProfile | RecruiterProfile | null
  status: AuthStatus
  isStudent: boolean
  isRecruiter: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<Role>
  register: (data: {
    name: string
    email: string
    password: string
    role: "student" | "recruiter"
  }) => Promise<Role>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  setProfile: (profile: StudentProfile | RecruiterProfile | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<StudentProfile | RecruiterProfile | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  const applyAuth = useCallback(
    (nextUser: User, nextProfile: StudentProfile | RecruiterProfile | null) => {
      setUser(nextUser)
      setProfile(nextProfile)
      setStatus("authenticated")
    },
    [],
  )

  const loadMe = useCallback(async () => {
    try {
      const { user: me, profile: meProfile } = await authApi.me()
      applyAuth(me, meProfile as StudentProfile | RecruiterProfile | null)
    } catch (err) {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
      setProfile(null)
      setStatus("unauthenticated")
      if (!(err instanceof ApiError && err.status === 401)) {
        setStatus("unauthenticated")
      }
    }
  }, [applyAuth])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setStatus("unauthenticated")
      return
    }
    loadMe()
  }, [loadMe])

  const login = useCallback(
    async (email: string, password: string) => {
      const { token, user: loggedIn } = await authApi.login(email, password)
      localStorage.setItem(TOKEN_KEY, token)
      const { profile: meProfile } = await authApi.me()
      applyAuth(loggedIn, meProfile as StudentProfile | RecruiterProfile | null)
      return loggedIn.role
    },
    [applyAuth],
  )

  const register = useCallback(
    async (data: {
      name: string
      email: string
      password: string
      role: "student" | "recruiter"
    }) => {
      const { token, user: registered } = await authApi.register(data)
      localStorage.setItem(TOKEN_KEY, token)
      const { profile: meProfile } = await authApi.me()
      applyAuth(registered, meProfile as StudentProfile | RecruiterProfile | null)
      return registered.role
    },
    [applyAuth],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout network failures; always clear local state.
    }
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setProfile(null)
    setStatus("unauthenticated")
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const { profile: meProfile } = await authApi.me()
    setProfile(meProfile as StudentProfile | RecruiterProfile | null)
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      status,
      isStudent: user?.role === "student",
      isRecruiter: user?.role === "recruiter",
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      refreshProfile,
      setProfile,
    }),
    [user, profile, status, login, register, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
