const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "Computer Science",
        "Information Technology",
        "Electronics & Communication",
        "Electrical",
        "Mechanical",
        "Civil",
        "Automobile",
        "Chemical",
        "Other",
      ],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      enum: [1, 2, 3, 4],
    },
    skills: {
      type: [String],
      default: [],
    },
    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: [0, "CGPA cannot be less than 0"],
      max: [10, "CGPA cannot exceed 10"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be at least 1"],
      max: [8, "Semester cannot exceed 8"],
    },
    resume: {
      type: resumeSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Student", studentSchema)
