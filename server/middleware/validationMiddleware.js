const { validationResult } = require("express-validator")
const ApiError = require("../utils/ApiError")

const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const details = errors.array().map((e) => ({
    field: e.path || e.param,
    message: e.msg,
  }))
  next(new ApiError(422, details[0].message, "VALIDATION_ERROR", details))
}

module.exports = { handleValidation }
