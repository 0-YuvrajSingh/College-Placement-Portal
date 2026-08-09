const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const dotenv = require("dotenv")

dotenv.config()

const authRoutes = require("./routes/authRoutes")
const studentRoutes = require("./routes/studentRoutes")
const recruiterRoutes = require("./routes/recruiterRoutes")
const jobRoutes = require("./routes/jobRoutes")
const applicationRoutes = require("./routes/applicationRoutes")
const adminRoutes = require("./routes/adminRoutes")
const statsController = require("./controllers/statsController")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const { swaggerSpec, swaggerUi } = require("./docs/swagger")

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))

const isTest = process.env.NODE_ENV === "test"

const passThrough = (req, res, next) => next()

const buildLimiter = (max, message) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message,
  })

const authLimiter = isTest
  ? passThrough
  : buildLimiter(100, {
      success: false,
      message: "Too many requests, please try again later",
      code: "RATE_LIMITED",
    })

const authLoginLimiter = isTest
  ? passThrough
  : buildLimiter(20, {
      success: false,
      message: "Too many login attempts, please try again later",
      code: "RATE_LIMITED",
    })

app.get("/api/health", (req, res) => {
  res.json({ success: true, data: "Server is running" })
})

app.get("/api/stats", statsController.getStats)

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use("/api/auth/login", authLoginLimiter)
app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/recruiter", recruiterRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/student/applications", applicationRoutes)
app.use("/api/admin", adminRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
