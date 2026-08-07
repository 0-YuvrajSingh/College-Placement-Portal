import type { Page } from "../../App"

export interface Crumb {
  label: string
  page?: Page
}

interface BreadcrumbProps {
  items: Crumb[]
  nav: (p: Page) => void
}

export default function Breadcrumb({ items, nav }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            {i > 0 && <span style={{ color: "#CBD5E1" }}>›</span>}
            {!isLast && item.page ? (
              <button onClick={() => nav(item.page as Page)}>
                {item.label}
              </button>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        )
      })}
    </div>
  )
}
