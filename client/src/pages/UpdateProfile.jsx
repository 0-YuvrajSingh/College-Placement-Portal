import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import ProfileForm from "../components/ProfileForm"
import Message from "../components/Message"

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const UpdateProfile = () => {
  const [profile, setProfile] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState("")
  const [resumeLoading, setResumeLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/students/me/profile")
        setProfile(data.data.profile)
      } catch (err) {
        setPageError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again.",
        )
      } finally {
        setPageLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleUpdate = async (payload) => {
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const { data } = await api.put("/students/me/profile", payload)
      setProfile(data.data.profile)
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0])
    setResumeError("")
  }

  const handleResumeUpload = async (e) => {
    e.preventDefault()
    setResumeError("")
    setSuccess("")

    if (!resumeFile) {
      setResumeError("Please choose a file to upload")
      return
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(resumeFile.type)) {
      setResumeError("Only PDF or Word (.pdf, .doc, .docx) files are allowed")
      return
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      setResumeError("File too large. Maximum allowed size is 5MB")
      return
    }

    const formData = new FormData()
    formData.append("resume", resumeFile)

    setResumeLoading(true)
    try {
      const { data } = await api.post("/students/me/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setProfile((prev) => ({ ...prev, resume: data.data.resume }))
      setResumeFile(null)
      setSuccess("Resume uploaded successfully")
    } catch (err) {
      setResumeError(
        err.response?.data?.message ||
          "Resume upload failed. Please try again.",
      )
    } finally {
      setResumeLoading(false)
    }
  }

  const handleResumeDelete = async () => {
    setResumeError("")
    setSuccess("")
    setDeleteLoading(true)

    try {
      await api.delete("/students/me/resume")
      setProfile((prev) => ({ ...prev, resume: null }))
      setSuccess("Resume deleted successfully")
    } catch (err) {
      setResumeError(
        err.response?.data?.message ||
          "Failed to delete resume. Please try again.",
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-page">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Message>{pageError}</Message>
            <Link to="/profile/create" className="btn btn-primary">
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h3 className="text-center mt-4">Update Student Profile</h3>
          <p className="text-center text-muted">
            Edit your details and resume below.
          </p>

          <Message variant="success">{success}</Message>

          <ProfileForm
            initialData={profile}
            onSubmit={handleUpdate}
            submitLabel="Update Profile"
            loading={loading}
            error={error}
          />

          <div className="card shadow-sm mt-4">
            <div className="card-body p-4">
              <h5 className="card-title mb-3">Resume</h5>

              <Message>{resumeError}</Message>

              {profile.resume ? (
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <a
                      href={profile.resume.path}
                      target="_blank"
                      rel="noreferrer"
                      className="fw-semibold"
                    >
                      {profile.resume.originalname}
                    </a>
                    <div className="text-muted small">
                      {formatBytes(profile.resume.size)} &middot;{" "}
                      {new Date(profile.resume.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleResumeDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete Resume"}
                  </button>
                </div>
              ) : (
                <p className="text-muted mb-3">No resume uploaded yet.</p>
              )}

              <form onSubmit={handleResumeUpload} className="mt-3">
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={resumeLoading || !resumeFile}
                  >
                    {resumeLoading ? "Uploading..." : "Upload Resume"}
                  </button>
                </div>
                <div className="form-text">
                  Accepted formats: PDF, DOC, DOCX. Max size: 5MB.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile
