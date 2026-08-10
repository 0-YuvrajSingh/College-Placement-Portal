const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
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

const deleteResumeFile = async (filename) => {
  if (!filename) return
  try {
    await fs.promises.unlink(path.join(getUploadsDir(), path.basename(filename)))
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Failed to delete resume file ${filename}: ${err.message}`)
    }
  }
}

// Copies an uploaded resume into an immutable snapshot file. Applications keep
// their own physical copy so a later resume replacement on the student profile
// never breaks downloads of already-submitted resumes.
const snapshotResumeFile = async (storedName) => {
  if (!storedName) return null
  const safeName = path.basename(storedName)
  const source = path.join(getUploadsDir(), safeName)
  if (!fs.existsSync(source)) {
    throw new ApiError(404, "Resume file not found", "RESUME_NOT_FOUND")
  }
  const ext = path.extname(safeName)
  const snapshotName = `snap-${crypto.randomUUID()}${ext}`
  await fs.promises.copyFile(source, path.join(getUploadsDir(), snapshotName))
  return snapshotName
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

// Validates that the stored file's magic bytes match a PDF or Word document.
// DOCX files are additionally required to be a real Office Open XML package
// (a ZIP containing word/document.xml), so a renamed .txt/.zip can't pass.
const validateResumeSignature = async (filePath, mimetype) => {
  const ext = path.extname(filePath).toLowerCase()
  let fh
  try {
    fh = await fs.promises.open(filePath, "r")
    const head = Buffer.alloc(8)
    const { bytesRead } = await fh.read(head, 0, 8, 0)
    const header = head.subarray(0, bytesRead)

    if (ext === ".pdf" || mimetype === "application/pdf") {
      return header.subarray(0, 4).toString("latin1") === "%PDF"
    }

    if (ext === ".doc" || mimetype === "application/msword") {
      // OLE2 compound document signature: D0 CF 11 E0 A1 B1 1A E1
      const ole = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
      return header.length >= 8 && header.equals(ole)
    }

    if (
      ext === ".docx" ||
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      if (header.subarray(0, 2).toString("latin1") !== "PK") return false
      return await isDocxPackage(filePath)
    }

    return false
  } catch (err) {
    if (err && err.code === "ENOENT") return false
    throw err
  } finally {
    if (fh) await fh.close()
  }
}

// Checks for the core parts of an Office Open XML package. This is a cheap
// structural check (not a full unzip) that still rejects arbitrary ZIP files.
const isDocxPackage = async (filePath) => {
  const fh = await fs.promises.open(filePath, "r")
  try {
    const { size } = await fh.stat()
    const limit = Math.min(size, 4 * 1024 * 1024)
    const buf = Buffer.alloc(limit)
    const { bytesRead } = await fh.read(buf, 0, limit, 0)
    const text = buf.subarray(0, bytesRead).toString("latin1")
    return (
      text.includes("[Content_Types].xml") &&
      text.includes("word/document.xml")
    )
  } finally {
    await fh.close()
  }
}

module.exports = {
  getUploadsDir,
  ensureUploadsDir,
  snapshotResumeFile,
  validateResumeSignature,
  deleteResumeFile,
  sendResumeFile,
}
