const path = require("path")
const multer = require("multer")
const { getUploadsDir, ensureUploadsDir } = require("../services/file.service")

const ALLOWED_MIMETYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"]
const MAX_FILE_SIZE =
  parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024

const uploadDir = getUploadsDir()
ensureUploadsDir()

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
    const error = new Error(
      "Only PDF or Word (.pdf, .doc, .docx) files are allowed",
    )
    error.statusCode = 400
    cb(error, false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
})

const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) return next(err)
    next()
  })
}

module.exports = { upload, uploadSingle, ALLOWED_MIMETYPES, MAX_FILE_SIZE }
