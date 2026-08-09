const express = require("express")
const applicationController = require("../controllers/applicationController")
const { protect, requireRole } = require("../middleware/authMiddleware")

const router = express.Router()

router.use(protect, requireRole("student"))

router.get("/", applicationController.getMyApplications)
router.get("/:id", applicationController.getMyApplication)
router.patch("/:id/withdraw", applicationController.withdraw)

module.exports = router
