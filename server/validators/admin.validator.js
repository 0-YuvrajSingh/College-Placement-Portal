const { body } = require("express-validator")

const studentStatusValidators = [
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
  body("isPlaced")
    .optional()
    .isBoolean()
    .withMessage("isPlaced must be a boolean"),
]

const recruiterStatusValidators = [
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  body("isApproved")
    .optional()
    .isBoolean()
    .withMessage("isApproved must be a boolean"),
]

module.exports = { studentStatusValidators, recruiterStatusValidators }
