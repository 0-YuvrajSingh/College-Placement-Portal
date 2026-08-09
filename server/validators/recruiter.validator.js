const { body } = require("express-validator")

const updateProfileValidators = [
  body("companyName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
  body("companyDescription")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("website").optional().trim().isURL({ require_protocol: false }),
  body("industry").optional().trim(),
  body("location").optional().trim(),
  body("contactPerson").optional().trim(),
  body("contactPhone")
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Contact phone must be 10-15 digits"),
  body("companySize").optional().trim(),
]

module.exports = { updateProfileValidators }
