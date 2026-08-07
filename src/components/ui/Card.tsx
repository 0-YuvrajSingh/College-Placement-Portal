import type { ReactNode } from "react"

interface CardProps {
  title?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export default function Card({
  title,
  icon,
  children,
  className = "",
}: CardProps) {
  return (
    <div className={`card ${className}`.trim()}>
      {title && (
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {icon}
            <h3 className="card-title" style={{ margin: 0 }}>
              {title}
            </h3>
          </div>
        </div>
      )}
      <div className="card-body" style={title ? { paddingTop: 16 } : undefined}>
        {children}
      </div>
    </div>
  )
}
