const express = require("express")
const authController = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware")
const { handleValidation } = require("../middleware/validationMiddleware")
const {
  registerValidators,
  loginValidators,
} = require("../validators/auth.validator")

const router = express.Router()

router.post(
  "/register",
  registerValidators,
  handleValidation,
  authController.register,
)

router.post("/login", loginValidators, handleValidation, authController.login)

router.post("/logout", protect, authController.logout)

router.get("/me", protect, authController.getMe)

module.exports = router
