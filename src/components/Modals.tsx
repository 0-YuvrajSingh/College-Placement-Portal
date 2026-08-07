import { useState } from "react"
import type { Page } from "../App"
import Modal from "./ui/Modal"
import Button from "./ui/Button"
import FileUpload from "./ui/FileUpload"
import { IconLogout, IconUpload, IconCheck } from "./ui/Icons"

interface LogoutModalProps {
  open: boolean
  onClose: () => void
  nav: (p: Page) => void
}

export function LogoutModal({ open, onClose, nav }: LogoutModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Logout"
      icon={
        <div className="modal-icon modal-icon-warning">
          <IconLogout strokeWidth={2} />
        </div>
      }
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onClose()
              nav("home")
            }}
          >
            Logout
          </Button>
        </>
      }
    >
      <p className="modal-body">
        Are you sure you want to logout? You will need to sign in again to
        access your profile.
      </p>
    </Modal>
  )
}

type UploadPhase = "idle" | "selected" | "uploading" | "success" | "error"

export function ResumeModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [phase, setPhase] = useState<UploadPhase>("idle")
  const [progress, setProgress] = useState(0)

  const handleSelect = (file: File | null) => {
    if (file) setPhase("selected")
  }
  const handleBrowse = () => setPhase("selected")
  const handleUpload = () => {
    setPhase("uploading")
    setProgress(0)
    let value = 0
    const timer = setInterval(() => {
      value = Math.min(100, value + 17)
      setProgress(value)
      if (value >= 100) {
        clearInterval(timer)
        setTimeout(() => setPhase("success"), 300)
      }
    }, 200)
  }
  const handleClose = () => {
    setPhase("idle")
    setProgress(0)
    onClose()
  }

  const canUpload = phase === "selected" || phase === "uploading"

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload Resume"
      icon={
        <div className="modal-icon modal-icon-primary">
          <IconUpload size={22} />
        </div>
      }
    >
      {phase === "success" ? (
        <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
          <div
            className="modal-icon modal-icon-success"
            style={{ margin: "0 auto 16px" }}
          >
            <IconCheck size={28} />
          </div>
          <p
            className="small"
            style={{ fontWeight: 600, color: "#1A2033", margin: "0 0 6px" }}
          >
            Upload Successful
          </p>
          <p className="xsmall" style={{ margin: "0 0 24px" }}>
            Arjun_Kumar_Resume.pdf has been uploaded successfully.
          </p>
          <Button block onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <>
          <FileUpload
            fileName={
              phase === "selected" || phase === "uploading"
                ? "Arjun_Kumar_Resume.pdf"
                : undefined
            }
            fileMeta={
              phase === "selected" || phase === "uploading"
                ? "245 KB · PDF"
                : undefined
            }
            error={
              phase === "error"
                ? "File type not supported. Use PDF, DOC, or DOCX."
                : undefined
            }
            onChange={handleSelect}
            onBrowse={handleBrowse}
          />

          {phase === "uploading" && (
            <div style={{ margin: "16px 0" }}>
              <div className="progress-row">
                <span className="small">Uploading...</span>
                <span className="mono" style={{ color: "#2563EB" }}>
                  {progress}%
                </span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              block
              onClick={handleUpload}
              disabled={!canUpload}
              loading={phase === "uploading"}
            >
              {phase === "uploading" ? "Uploading..." : "Upload Resume"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}
