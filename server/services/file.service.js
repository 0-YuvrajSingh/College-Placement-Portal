const fs = require("fs")
const path = require("path")
const ApiError = require("../utils/ApiError")

const getUploadsDir = () => {
  const dirName = process.env.UPLOAD_DIR || "uploads"
  return path.join(__dirname, "..", dirName)
}

const ensureUploadsDir = () => {
  const dir = getUploadsDir()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

ensureUploadsDir()

const deleteResumeFile = (filename) => {
  if (!filename) return
  const filePath = path.join(getUploadsDir(), path.basename(filename))
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error(`Failed to delete resume file ${filename}: ${err.message}`)
    }
  })
}

const sendResumeFile = (res, storedName, originalName) => {
  const safeName = path.basename(storedName)
  const filePath = path.join(getUploadsDir(), safeName)
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, "Resume file not found", "RESUME_NOT_FOUND")
  }
  const downloadName = originalName || safeName
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(downloadName)}"`,
  )
  res.sendFile(filePath)
}

module.exports = {
  getUploadsDir,
  ensureUploadsDir,
  deleteResumeFile,
  sendResumeFile,
}
