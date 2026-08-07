import type { ReactNode } from "react"
import { useEffect } from "react"
import { IconClose } from "./Icons"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  icon?: ReactNode
  children: ReactNode
  actions?: ReactNode
  maxWidth?: number
}

export default function Modal({
  open,
  onClose,
  title,
  icon,
  children,
  actions,
  maxWidth = 480,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || icon) && (
          <div className="modal-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {icon}
              {title && <h3 className="modal-title">{title}</h3>}
            </div>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <IconClose />
            </button>
          </div>
        )}
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  )
}
