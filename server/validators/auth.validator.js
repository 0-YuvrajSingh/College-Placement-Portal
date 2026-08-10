const { body } = require("express-validator")
const { ROLES, DEPARTMENTS } = require("../config/constants")

const registerValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isLength({ max: 100 })
    .withMessage("Password cannot exceed 100 characters"),
  body("role")
    .optional()
    .isIn([ROLES.STUDENT, ROLES.RECRUITER])
    .withMessage("Role must be student or recruiter"),
  body("department")
    .optional({ values: "falsy" })
    .trim()
    .isIn(DEPARTMENTS)
    .withMessage("Department must be a valid branch"),
  body("cgpa")
    .optional({ values: "falsy" })
    .isFloat({ min: 0, max: 10 })
    .withMessage("CGPA must be between 0 and 10"),
  body("rollNumber")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 30 })
    .withMessage("Roll number cannot exceed 30 characters"),
  body("companyName")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
]

const loginValidators = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
]

module.exports = { registerValidators, loginValidators }
