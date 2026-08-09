const { body } = require("express-validator")
const { ROLES } = require("../config/constants")

const registerValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .isLength({ max: 100 })
    .withMessage("Password cannot exceed 100 characters"),
  body("role")
    .optional()
    .isIn([ROLES.STUDENT, ROLES.RECRUITER])
    .withMessage("Role must be student or recruiter"),
]

const loginValidators = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
]

module.exports = { registerValidators, loginValidators }
