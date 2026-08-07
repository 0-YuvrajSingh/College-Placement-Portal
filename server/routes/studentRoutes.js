const express = require("express")
const { body } = require("express-validator")
const {
  getProfile,
  createProfile,
  updateProfile,
  uploadResume,
  deleteResume,
} = require("../controllers/studentController")
const { protect, requireRole } = require("../middleware/authMiddleware")
const { upload } = require("../middleware/uploadMiddleware")

const router = express.Router()

router.use(protect, requireRole("student"))

const profileValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("phone")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone number must be 10-15 digits"),
  body("department").notEmpty().withMessage("Department is required"),
  body("year")
    .isInt({ min: 1, max: 4 })
    .withMessage("Year must be between 1 and 4"),
  body("skills")
    .optional()
    .isArray({ min: 0 })
    .withMessage("Skills must be an array"),
  body("cgpa")
    .isFloat({ min: 0, max: 10 })
    .withMessage("CGPA must be between 0 and 10"),
  body("semester")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),
]

router
  .route("/me/profile")
  .get(getProfile)
  .post(profileValidators, createProfile)
  .put(profileValidators, updateProfile)

router.post(
  "/me/resume",
  (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
      if (err) {
        const message =
          err.code === "LIMIT_FILE_SIZE"
            ? "File too large. Maximum allowed size is 5MB"
            : err.message || "File upload failed"
        return res.status(400).json({ success: false, message })
      }
      next()
    })
  },
  uploadResume,
)

router.delete("/me/resume", deleteResume)

module.exports = router
