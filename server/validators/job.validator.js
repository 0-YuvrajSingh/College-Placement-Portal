const { body } = require("express-validator")
const { EMPLOYMENT_TYPES, WORK_MODES, JOB_STATUS, DEPARTMENTS } = require("../config/constants")

const changeJobStatusValidators = [
  body("status")
    .isIn(Object.values(JOB_STATUS))
    .withMessage(`Status must be one of: ${Object.values(JOB_STATUS).join(", ")}`),
]

const createJobValidators = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 120 })
    .withMessage("Job title cannot exceed 120 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
  body("applicationDeadline")
    .isISO8601()
    .withMessage("Application deadline must be a valid date"),
  body("location").optional().trim().isLength({ max: 100 }),
  body("employmentType")
    .optional()
    .isIn(EMPLOYMENT_TYPES)
    .withMessage("Invalid employment type"),
  body("workMode")
    .optional()
    .isIn(WORK_MODES)
    .withMessage("Invalid work mode"),
  body("salary").optional().isObject().withMessage("Salary must be an object"),
  body("salary.min").optional().isFloat({ min: 0 }),
  body("salary.max").optional().isFloat({ min: 0 }),
  body("salary.currency").optional().isString(),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("skills.*").optional().isString().withMessage("Skills must be strings"),
  body("eligibility")
    .optional()
    .isObject()
    .withMessage("Eligibility must be an object"),
  body("eligibility.minimumCgpa")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("minimumCgpa must be between 0 and 10"),
  body("eligibility.eligibleDepartments")
    .optional()
    .isArray()
    .withMessage("eligibleDepartments must be an array"),
  body("eligibility.eligibleDepartments.*")
    .optional()
    .isIn(DEPARTMENTS)
    .withMessage("Invalid department in eligibleDepartments"),
  body("eligibility.eligibleGraduationYears")
    .optional()
    .isArray()
    .withMessage("eligibleGraduationYears must be an array"),
  body("eligibility.eligibleGraduationYears.*")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Invalid graduation year"),
  body("eligibility.requiredSkills")
    .optional()
    .isArray()
    .withMessage("requiredSkills must be an array"),
  body("eligibility.requiredSkills.*")
    .optional()
    .isString()
    .withMessage("Required skills must be strings"),
  body("eligibility.backlogAllowed")
    .optional()
    .isBoolean()
    .withMessage("backlogAllowed must be a boolean"),
  body("status")
    .optional()
    .isIn([JOB_STATUS.DRAFT, JOB_STATUS.OPEN])
    .withMessage("Status must be DRAFT or OPEN"),
]

const updateJobValidators = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Job title cannot be empty")
    .isLength({ max: 120 })
    .withMessage("Job title cannot exceed 120 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Job description cannot be empty")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),
  body("companyName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Application deadline must be a valid date"),
  body("location").optional().trim().isLength({ max: 100 }),
  body("employmentType")
    .optional()
    .isIn(EMPLOYMENT_TYPES)
    .withMessage("Invalid employment type"),
  body("workMode")
    .optional()
    .isIn(WORK_MODES)
    .withMessage("Invalid work mode"),
  body("salary").optional().isObject().withMessage("Salary must be an object"),
  body("salary.min").optional().isFloat({ min: 0 }),
  body("salary.max").optional().isFloat({ min: 0 }),
  body("salary.currency").optional().isString(),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("skills.*").optional().isString().withMessage("Skills must be strings"),
  body("eligibility")
    .optional()
    .isObject()
    .withMessage("Eligibility must be an object"),
  body("eligibility.minimumCgpa")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("minimumCgpa must be between 0 and 10"),
  body("eligibility.eligibleDepartments")
    .optional()
    .isArray()
    .withMessage("eligibleDepartments must be an array"),
  body("eligibility.eligibleDepartments.*")
    .optional()
    .isIn(DEPARTMENTS)
    .withMessage("Invalid department in eligibleDepartments"),
  body("eligibility.eligibleGraduationYears")
    .optional()
    .isArray()
    .withMessage("eligibleGraduationYears must be an array"),
  body("eligibility.eligibleGraduationYears.*")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Invalid graduation year"),
  body("eligibility.requiredSkills")
    .optional()
    .isArray()
    .withMessage("requiredSkills must be an array"),
  body("eligibility.requiredSkills.*")
    .optional()
    .isString()
    .withMessage("Required skills must be strings"),
  body("eligibility.backlogAllowed")
    .optional()
    .isBoolean()
    .withMessage("backlogAllowed must be a boolean"),
  body("status")
    .optional()
    .isIn([JOB_STATUS.DRAFT, JOB_STATUS.OPEN])
    .withMessage("Status must be DRAFT or OPEN"),
]

module.exports = { createJobValidators, updateJobValidators, changeJobStatusValidators }
