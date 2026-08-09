const express = require("express")
const jobController = require("../controllers/jobController")
const applicationController = require("../controllers/applicationController")
const { protect, requireRole } = require("../middleware/authMiddleware")

const router = express.Router()

router.use(protect)

router.get("/", jobController.listJobs)

router.post(
  "/:jobId/apply",
  requireRole("student"),
  applicationController.apply,
)

router.get("/:id", jobController.getJob)

module.exports = router
