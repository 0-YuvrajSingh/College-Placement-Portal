const { body } = require("express-validator")
const { DEPARTMENTS } = require("../config/constants")

const createProfileValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("phone")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone number must be 10-15 digits"),
  body("department")
    .isIn(DEPARTMENTS)
    .withMessage("Please provide a valid department"),
  body("year")
    .isInt({ min: 1, max: 4 })
    .withMessage("Year must be between 1 and 4"),
  body("semester")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),
  body("cgpa")
    .isFloat({ min: 0, max: 10 })
    .withMessage("CGPA must be between 0 and 10"),
  body("graduationYear")
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Graduation year must be a valid year"),
]

const updateProfileValidators = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Please provide a valid email address"),
  body("phone")
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone number must be 10-15 digits"),
  body("department")
    .optional()
    .isIn(DEPARTMENTS)
    .withMessage("Please provide a valid department"),
  body("year")
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage("Year must be between 1 and 4"),
  body("semester")
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),
  body("cgpa")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("CGPA must be between 0 and 10"),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("skills.*").optional().isString().withMessage("Skills must be strings"),
  body("graduationYear")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Graduation year must be a valid year"),
  body("rollNumber").optional().trim().notEmpty().withMessage("Roll number cannot be empty"),
  body("registrationNumber").optional().trim(),
  body("college").optional().trim(),
  body("course").optional().trim(),
  body("hasActiveBacklogs")
    .optional()
    .isBoolean()
    .withMessage("hasActiveBacklogs must be a boolean"),
  body("education")
    .optional()
    .isArray()
    .withMessage("Education must be an array"),
  body("education.*.degree").optional().isString(),
  body("education.*.institution").optional().isString(),
  body("education.*.startYear")
    .optional()
    .isInt({ min: 1990, max: 2100 }),
  body("education.*.endYear")
    .optional()
    .isInt({ min: 1990, max: 2100 }),
  body("education.*.percentage")
    .optional()
    .isFloat({ min: 0, max: 100 }),
]

module.exports = { createProfileValidators, updateProfileValidators }
