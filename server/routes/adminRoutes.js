const express = require("express")
const adminController = require("../controllers/adminController")
const { protect, requireRole } = require("../middleware/authMiddleware")
const { handleValidation } = require("../middleware/validationMiddleware")
const { changeJobStatusValidators } = require("../validators/job.validator")
const {
  studentStatusValidators,
  recruiterStatusValidators,
} = require("../validators/admin.validator")

const router = express.Router()

router.use(protect, requireRole("admin"))

router.get("/dashboard", adminController.dashboard)

router.get("/students", adminController.listStudents)
router.get("/students/:id", adminController.getStudent)
router.patch(
  "/students/:id/status",
  studentStatusValidators,
  handleValidation,
  adminController.updateStudentStatus,
)

router.get("/recruiters", adminController.listRecruiters)
router.get("/recruiters/:id", adminController.getRecruiter)
router.patch(
  "/recruiters/:id/status",
  recruiterStatusValidators,
  handleValidation,
  adminController.updateRecruiterStatus,
)

router.get("/jobs", adminController.listJobs)
router.get("/jobs/:id", adminController.getJob)
router.patch(
  "/jobs/:id/status",
  changeJobStatusValidators,
  handleValidation,
  adminController.updateJobStatus,
)

router.get("/applications", adminController.listApplications)
router.get("/applications/:id", adminController.getApplication)
router.get("/applications/:id/resume", adminController.getApplicationResume)

router.get("/audit-logs", adminController.getAuditLogs)

module.exports = router
