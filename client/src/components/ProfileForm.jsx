import { useState } from "react"
import Message from "./Message"

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical",
  "Mechanical",
  "Civil",
  "Automobile",
  "Chemical",
  "Other",
]

const ProfileForm = ({
  initialData,
  onSubmit,
  submitLabel,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    department: initialData?.department || "",
    year: initialData?.year || "",
    skills: initialData?.skills?.join(", ") || "",
    cgpa: initialData?.cgpa || "",
    semester: initialData?.semester || "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      department: formData.department,
      year: Number(formData.year),
      semester: Number(formData.semester),
      cgpa: Number(formData.cgpa),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    }

    onSubmit(payload)
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body p-4">
        <Message>{error}</Message>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10,15}"
                placeholder="10-15 digits"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <select
                className="form-select"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="year" className="form-label">
                Year
              </label>
              <select
                className="form-select"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select year</option>
                {[1, 2, 3, 4].map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="semester" className="form-label">
                Semester
              </label>
              <select
                className="form-select"
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="cgpa" className="form-label">
                CGPA
              </label>
              <input
                type="number"
                className="form-control"
                id="cgpa"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                placeholder="0.0 - 10.0"
                required
              />
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="skills" className="form-label">
                Skills
              </label>
              <input
                type="text"
                className="form-control"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Comma separated, e.g. JavaScript, MongoDB, Communication"
              />
              <div className="form-text">
                Separate multiple skills with commas.
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileForm
