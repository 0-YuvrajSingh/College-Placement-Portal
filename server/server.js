const path = require("path")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const studentRoutes = require("./routes/studentRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

connectDB()

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/api/health", (req, res) => {
  res.json({ success: true, data: "Server is running" })
})

app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  )
})
