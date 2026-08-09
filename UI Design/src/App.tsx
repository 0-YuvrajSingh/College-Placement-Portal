import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { Role } from './data/mock'
import AppShell from './components/layout/AppShell'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

import StudentDashboard from './pages/student/Dashboard'
import StudentJobs from './pages/student/Jobs'
import JobDetail from './pages/student/JobDetail'
import Applications from './pages/student/Applications'
import Profile from './pages/student/Profile'

import RecruiterDashboard from './pages/recruiter/Dashboard'
import JobManagement from './pages/recruiter/JobManagement'
import Applicants from './pages/recruiter/Applicants'
import ApplicantDetail from './pages/recruiter/ApplicantDetail'

import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminRecruiters from './pages/admin/Recruiters'
import AdminJobs from './pages/admin/Jobs'
import AdminApplications from './pages/admin/Applications'

export default function App() {
  const [role, setRole] = useState<Role>('student')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={setRole} />} />
        <Route path="/register" element={<Register onLogin={setRole} />} />

        {/* Student */}
        <Route path="/student" element={<AppShell role={role} onRoleChange={setRole}><StudentDashboard /></AppShell>} />
        <Route path="/student/jobs" element={<AppShell role={role} onRoleChange={setRole}><StudentJobs /></AppShell>} />
        <Route path="/student/jobs/:id" element={<AppShell role={role} onRoleChange={setRole}><JobDetail /></AppShell>} />
        <Route path="/student/applications" element={<AppShell role={role} onRoleChange={setRole}><Applications /></AppShell>} />
        <Route path="/student/profile" element={<AppShell role={role} onRoleChange={setRole}><Profile /></AppShell>} />

        {/* Recruiter */}
        <Route path="/recruiter" element={<AppShell role={role} onRoleChange={setRole}><RecruiterDashboard /></AppShell>} />
        <Route path="/recruiter/jobs" element={<AppShell role={role} onRoleChange={setRole}><JobManagement /></AppShell>} />
        <Route path="/recruiter/applicants" element={<AppShell role={role} onRoleChange={setRole}><Applicants /></AppShell>} />
        <Route path="/recruiter/applicants/:id" element={<AppShell role={role} onRoleChange={setRole}><ApplicantDetail /></AppShell>} />

        {/* Admin */}
        <Route path="/admin" element={<AppShell role={role} onRoleChange={setRole}><AdminDashboard /></AppShell>} />
        <Route path="/admin/students" element={<AppShell role={role} onRoleChange={setRole}><AdminStudents /></AppShell>} />
        <Route path="/admin/recruiters" element={<AppShell role={role} onRoleChange={setRole}><AdminRecruiters /></AppShell>} />
        <Route path="/admin/jobs" element={<AppShell role={role} onRoleChange={setRole}><AdminJobs /></AppShell>} />
        <Route path="/admin/applications" element={<AppShell role={role} onRoleChange={setRole}><AdminApplications /></AppShell>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
