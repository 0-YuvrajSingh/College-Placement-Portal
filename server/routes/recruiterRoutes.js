const express = require("express")
const recruiterController = require("../controllers/recruiterController")
const {
  protect,
  requireRole,
  requireApprovedRecruiter,
} = require("../middleware/authMiddleware")
const { handleValidation } = require("../middleware/validationMiddleware")
const {
  updateProfileValidators,
} = require("../validators/recruiter.validator")
const {
  createJobValidators,
  updateJobValidators,
  changeJobStatusValidators,
} = require("../validators/job.validator")
const { updateStatusValidators } = require("../validators/application.validator")

const router = express.Router()

router.use(protect, requireRole("recruiter"))

router.get("/profile", recruiterController.getProfile)
router.put(
  "/profile",
  updateProfileValidators,
  handleValidation,
  recruiterController.updateProfile,
)

router.post(
  "/jobs",
  requireApprovedRecruiter,
  createJobValidators,
  handleValidation,
  recruiterController.createJob,
)
router.get("/jobs", recruiterController.getJobs)
router.get("/jobs/:id", recruiterController.getJob)
router.put(
  "/jobs/:id",
  requireApprovedRecruiter,
  updateJobValidators,
  handleValidation,
  recruiterController.updateJob,
)
router.patch(
  "/jobs/:id/status",
  requireApprovedRecruiter,
  changeJobStatusValidators,
  handleValidation,
  recruiterController.changeJobStatus,
)
router.delete("/jobs/:id", requireApprovedRecruiter, recruiterController.deleteJob)

router.get("/jobs/:jobId/applications", recruiterController.getJobApplications)
router.get("/applications", recruiterController.listApplications)
router.get("/applications/:id", recruiterController.getApplication)
router.patch(
  "/applications/:id/status",
  requireApprovedRecruiter,
  updateStatusValidators,
  handleValidation,
  recruiterController.updateApplicationStatus,
)
router.get("/applications/:id/resume", recruiterController.getApplicationResume)
router.get("/stats", recruiterController.getStats)

module.exports = router
