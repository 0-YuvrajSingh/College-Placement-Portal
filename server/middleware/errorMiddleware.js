const ApiError = require("../utils/ApiError")

const notFound = (req, res, next) => {
  next(
    new ApiError(
      404,
      `Route not found - ${req.originalUrl}`,
      "NOT_FOUND",
    ),
  )
}

const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.statusCode ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500)
  let message = err.message || "Internal Server Error"
  let code = err.code || "INTERNAL_ERROR"
  const details = err.details || null

  if (err.name === "CastError") {
    statusCode = 400
    message = "Invalid resource identifier"
    code = "INVALID_ID"
  } else if (err.code === 11000) {
    statusCode = 409
    message = "Duplicate value entered, please use a different value"
    code = "DUPLICATE_RESOURCE"
  } else if (err.name === "ValidationError") {
    statusCode = 422
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ")
    code = "VALIDATION_ERROR"
  } else if (err.name === "MulterError") {
    statusCode = 400
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Maximum allowed size is 5MB"
        : err.message
    code = "FILE_UPLOAD_ERROR"
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    code = err.code || "ERROR"
  }

  const payload = { success: false, message, code }
  if (details) {
    payload.details = details
  }
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack
  }

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${message}`, err.stack)
  }

  res.status(statusCode).json(payload)
}

module.exports = { notFound, errorHandler }
