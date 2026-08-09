const express = require("express")
const studentController = require("../controllers/studentController")
const { protect, requireRole } = require("../middleware/authMiddleware")
const { uploadSingle } = require("../middleware/uploadMiddleware")
const { handleValidation } = require("../middleware/validationMiddleware")
const {
  createProfileValidators,
  updateProfileValidators,
} = require("../validators/student.validator")

const router = express.Router()

router.use(protect, requireRole("student"))

router
  .route("/me/profile")
  .get(studentController.getProfile)
  .post(
    createProfileValidators,
    handleValidation,
    studentController.createProfile,
  )
  .put(
    updateProfileValidators,
    handleValidation,
    studentController.updateProfile,
  )

router.get("/me/resume", studentController.downloadResume)
router.post("/me/resume", uploadSingle("resume"), studentController.uploadResume)
router.delete("/me/resume", studentController.deleteResume)

module.exports = router
