import { useState } from "react"
import { IconDocument, IconUpload } from "./Icons"
import Button from "./Button"

interface FileUploadProps {
  fileName?: string
  fileMeta?: string
  error?: string
  onChange?: (file: File | null) => void
  onBrowse?: () => void
}

const ALLOWED_HINT = "PDF, DOC, or DOCX up to 5MB"

export default function FileUpload({
  fileName,
  fileMeta,
  error,
  onChange,
  onBrowse,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const selected = Boolean(fileName)
  const zoneClass = [
    "drop-zone",
    dragOver ? "is-over" : "",
    selected ? "is-selected" : "",
    error ? "is-error" : "",
  ]
    .filter(Boolean)
    .join(" ")

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && onChange) onChange(file)
    else if (file && onBrowse) onBrowse()
  }

  return (
    <div
      className={zoneClass}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {selected ? (
        <div className="file-row" style={{ justifyContent: "center" }}>
          <div className="file-icon-box">
            <IconDocument size={20} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p
              className="small"
              style={{ fontWeight: 600, color: "#1A2033", marginBottom: 2 }}
            >
              {fileName}
            </p>
            {fileMeta && (
              <p className="xsmall" style={{ margin: 0 }}>
                {fileMeta}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <IconUpload size={36} strokeWidth={1.5} />
          <p
            style={{
              margin: "12px 0 4px",
              fontWeight: 500,
              color: "#1A2033",
              fontSize: 14,
            }}
          >
            Drag & drop your resume here
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "#8993A4" }}>
            {ALLOWED_HINT}
          </p>
          <Button variant="secondary" size="sm" onClick={onBrowse}>
            Browse Files
          </Button>
        </>
      )}
    </div>
  )
}
