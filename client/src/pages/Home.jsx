import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="container py-5">
      <div className="row justify-content-center text-center">
        <div className="col-lg-8">
          <h1 className="display-5 fw-bold mb-3">College Placement Portal</h1>
          <p className="lead text-muted mb-4">
            Create and manage your student profile to get ready for campus
            placements. Keep your details, skills and resume up to date in one
            place.
          </p>

          {user ? (
            <Link to="/profile" className="btn btn-primary btn-lg">
              Go to My Profile
            </Link>
          ) : (
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="btn btn-primary btn-lg">
                Register as Student
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Student Authentication</h5>
              <p className="card-text text-muted mb-0">
                Secure registration and login with JWT tokens stored in your
                browser.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Profile Management</h5>
              <p className="card-text text-muted mb-0">
                Create, view and update your academic profile with department,
                CGPA, semester, year and skills.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Resume Upload</h5>
              <p className="card-text text-muted mb-0">
                Upload, download and delete your resume in PDF or Word format.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
