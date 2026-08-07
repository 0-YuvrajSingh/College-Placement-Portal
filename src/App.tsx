import { useState } from "react"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreateProfile from "./pages/CreateProfile"
import ViewProfile from "./pages/ViewProfile"
import UpdateProfile from "./pages/UpdateProfile"
import ErrorStates from "./pages/ErrorStates"

export type Page = "home" | "register" | "login" | "dashboard" | "create-profile" | "view-profile" | "update-profile" | "errors"

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)

  const nav = (p: Page) => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  const props = { nav, setLogoutOpen, setResumeOpen, logoutOpen, resumeOpen }

  return (
    <>
      {page === "home" && <Home {...props} />}
      {page === "register" && <Register {...props} />}
      {page === "login" && <Login {...props} />}
      {page === "dashboard" && <Dashboard {...props} />}
      {page === "create-profile" && <CreateProfile {...props} />}
      {page === "view-profile" && <ViewProfile {...props} />}
      {page === "update-profile" && <UpdateProfile {...props} />}
      {page === "errors" && <ErrorStates {...props} />}
    </>
  )
}
