import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"
import ProfileForm from "../components/ProfileForm"
import Message from "../components/Message"

const CreateProfile = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleCreate = async (payload) => {
    setError("")
    setLoading(true)

    try {
      await api.post("/students/me/profile", payload)
      navigate("/profile")
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create profile. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h3 className="text-center mt-4">Create Student Profile</h3>
          <p className="text-center text-muted">
            Fill in your academic details below.
          </p>

          <Message variant="info">
            Have a profile already? <Link to="/profile">View it here</Link>.
          </Message>

          <ProfileForm
            onSubmit={handleCreate}
            submitLabel="Create Profile"
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateProfile
