import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"
import Message from "../components/Message"

const ViewProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/students/me/profile")
        setProfile(data.data.profile)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again.",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleDeleteResume = async () => {
    setDeleteError("")
    setDeleteLoading(true)

    try {
      await api.delete("/students/me/resume")
      setProfile((prev) => ({ ...prev, resume: null }))
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          "Failed to delete resume. Please try again.",
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-page">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center mt-5">
            <Message>{error}</Message>
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
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h3 className="mb-0">Student Profile</h3>
            <Link to="/profile/update" className="btn btn-outline-primary">
              Edit Profile
            </Link>
          </div>

          <div className="card shadow-sm mt-3">
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="text-muted small">Full Name</div>
                  <div className="fw-semibold">{profile.name}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Email</div>
                  <div className="fw-semibold">{profile.email}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Phone</div>
                  <div className="fw-semibold">{profile.phone}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Department</div>
                  <div className="fw-semibold">{profile.department}</div>
                </div>
                <div className="col-md-4">
                  <div className="text-muted small">Year</div>
                  <div className="fw-semibold">{profile.year}</div>
                </div>
                <div className="col-md-4">
                  <div className="text-muted small">Semester</div>
                  <div className="fw-semibold">{profile.semester}</div>
                </div>
                <div className="col-md-4">
                  <div className="text-muted small">CGPA</div>
                  <div className="fw-semibold">{profile.cgpa}</div>
                </div>
                <div className="col-12">
                  <div className="text-muted small mb-1">Skills</div>
                  <div>
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-secondary me-1 mb-1"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">Not specified</span>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="text-muted small mb-1">Resume</div>
                  <Message variant="danger">{deleteError}</Message>
                  {profile.resume ? (
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border rounded p-3">
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
                          {(profile.resume.size / 1024).toFixed(1)} KB &middot;
                          uploaded on{" "}
                          {new Date(
                            profile.resume.uploadedAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleDeleteResume}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-muted">No resume uploaded.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-3 mb-5">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/profile/update")}
            >
              Upload / Update Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile
