import type { ComponentType } from "react"
import type { Page } from "../App"
import {
  IconHome,
  IconUser,
  IconPencil,
  IconDocument,
  IconChart,
} from "./ui/Icons"

interface Props {
  nav: (p: Page) => void
  active: Page
}

interface IconProps {
  size?: number
}

interface NavItem {
  label: string
  page: Page
  Icon: ComponentType<IconProps>
}

const items: NavItem[] = [
  { label: "Dashboard", page: "dashboard", Icon: IconHome },
  { label: "My Profile", page: "view-profile", Icon: IconUser },
  { label: "Update Profile", page: "update-profile", Icon: IconPencil },
  { label: "Resume", page: "view-profile", Icon: IconDocument },
  { label: "Settings", page: "errors", Icon: IconChart },
]

export default function Sidebar({ nav, active }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-label eyebrow">Navigation</div>
      {items.map(({ label, page, Icon }) => (
        <button
          key={label}
          className={`sidebar-item ${active === page ? "is-active" : ""}`}
          onClick={() => nav(page)}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </aside>
  )
}
