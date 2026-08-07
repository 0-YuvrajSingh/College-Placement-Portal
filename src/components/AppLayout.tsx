import type { ReactNode } from "react"
import type { Page } from "../App"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

interface Props {
  nav: (p: Page) => void
  active: Page
  setLogoutOpen: (v: boolean) => void
  children: ReactNode
}

export default function AppLayout({
  nav,
  active,
  setLogoutOpen,
  children,
}: Props) {
  return (
    <div className="page">
      <Navbar nav={nav} variant="app" setLogoutOpen={setLogoutOpen} />
      <div className="app-body">
        <Sidebar nav={nav} active={active} />
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
