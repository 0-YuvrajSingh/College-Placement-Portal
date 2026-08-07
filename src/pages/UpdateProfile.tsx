import { useState } from "react"
import AppLayout from "../components/AppLayout"
import Breadcrumb from "../components/ui/Breadcrumb"
import Alert from "../components/ui/Alert"
import ProfileForm, { type ProfileData } from "../components/ProfileForm"
import { LogoutModal, ResumeModal } from "../components/Modals"
import type { Page } from "../App"
import { IconCheck } from "../components/ui/Icons"

interface Props {
  nav: (p: Page) => void
  logoutOpen: boolean
  resumeOpen: boolean
  setLogoutOpen: (v: boolean) => void
  setResumeOpen: (v: boolean) => void
}

const INITIAL: ProfileData = {
  name: "Arjun Kumar",
  email: "arjun.kumar@college.edu",
  phone: "+91 98765 43210",
  dept: "Computer Science Engineering",
  year: "4th Year",
  semester: "Sem VII",
  cgpa: "8.74",
  skills: "React, Node.js, Python, Machine Learning, SQL, Git",
  bio: "Final year CSE student passionate about full-stack development and building products that matter.",
}

export default function UpdateProfile({
  nav,
  logoutOpen,
  resumeOpen,
  setLogoutOpen,
  setResumeOpen,
}: Props) {
  const [data, setData] = useState<ProfileData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onChange = (field: keyof ProfileData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => setData(INITIAL)

  const handleSubmit = () => {
    const e: Record<string, string> = {}
    if (!data.name.trim()) e.name = "Full name is required"
    if (!data.email.includes("@")) e.email = "Enter a valid email address"
    if (!data.phone.trim()) e.phone = "Phone number is required"
    if (!data.cgpa || Number(data.cgpa) < 0 || Number(data.cgpa) > 10)
      e.cgpa = "CGPA must be between 0 and 10"
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1200)
  }

  return (
    <div className="page">
      <AppLayout
        nav={nav}
        active="update-profile"
        setLogoutOpen={setLogoutOpen}
      >
        <Breadcrumb
          items={[
            { label: "Dashboard", page: "dashboard" },
            { label: "Update Profile" },
          ]}
          nav={nav}
        />

        {saved && (
          <div className="section-gap">
            <Alert variant="success">
              <IconCheck size={16} />
              Your profile has been updated successfully.
            </Alert>
          </div>
        )}

        <ProfileForm
          data={data}
          errors={errors}
          onChange={onChange}
          onSubmit={handleSubmit}
          onCancel={() => nav("view-profile")}
          onReset={handleReset}
          submitLabel="Save Changes"
          saving={saving}
        />
      </AppLayout>

      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        nav={nav}
      />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  )
}
