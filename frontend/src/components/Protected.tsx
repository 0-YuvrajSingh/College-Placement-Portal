import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { PageLoader } from "@/components/ui"
import type { Role } from "@/types"

function homeForRole(role: Role): string {
  if (role === "admin") return "/admin"
  if (role === "recruiter") return "/recruiter"
  return "/dashboard"
}

export default function Protected({
  role,
  children,
}: {
  role?: Role
  children: ReactNode
}) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === "loading") {
    return <PageLoader label="Checking your session…" />
  }

  if (status === "unauthenticated" || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (role && user.role !== role) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  return <>{children}</>
}
