const path = require("path")
const fs = require("fs")
const multer = require("multer")

const ALLOWED_MIMETYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

const uploadDir = path.join(__dirname, "..", "uploads")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()

  if (
    ALLOWED_MIMETYPES.includes(file.mimetype) &&
    ALLOWED_EXTENSIONS.includes(ext)
  ) {
    cb(null, true)
  } else {
    cb(
      new Error("Only PDF or Word (.pdf, .doc, .docx) files are allowed"),
      false,
    )
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
})

module.exports = { upload, ALLOWED_MIMETYPES, MAX_FILE_SIZE }
