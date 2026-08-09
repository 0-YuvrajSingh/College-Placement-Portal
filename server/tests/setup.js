const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")

process.env.NODE_ENV = "test"
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key"
process.env.JWT_EXPIRES_IN = "1d"
process.env.MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placement_portal_test"
process.env.UPLOAD_DIR = "uploads-test"
process.env.CLIENT_URL = "http://localhost:5173"
process.env.MAX_FILE_SIZE = "5242880"

const TEST_UPLOAD_DIR = path.join(__dirname, "..", process.env.UPLOAD_DIR)

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI)
  await mongoose.connection.dropDatabase()
  await mongoose.connection.syncIndexes()
})

beforeEach(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.syncIndexes()
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  if (fs.existsSync(TEST_UPLOAD_DIR)) {
    fs.rmSync(TEST_UPLOAD_DIR, { recursive: true, force: true })
  }
})
