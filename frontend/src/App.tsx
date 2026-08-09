import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Layout from "@/components/Layout"
import Protected from "@/components/Protected"
import { AuthProvider } from "@/context/AuthContext"
import { ToastProvider } from "@/context/ToastContext"

import Landing from "@/pages/Landing"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"

import StudentDashboard from "@/pages/student/Dashboard"
import StudentJobs from "@/pages/student/Jobs"
import StudentJobDetail from "@/pages/student/JobDetail"
import StudentApplications from "@/pages/student/Applications"
import StudentProfile from "@/pages/student/Profile"

import RecruiterDashboard from "@/pages/recruiter/Dashboard"
import RecruiterJobs from "@/pages/recruiter/Jobs"
import RecruiterJobForm from "@/pages/recruiter/JobForm"
import RecruiterJobDetail from "@/pages/recruiter/JobDetail"
import RecruiterApplications from "@/pages/recruiter/Applications"
import RecruiterApplicationDetail from "@/pages/recruiter/ApplicationDetail"
import RecruiterProfile from "@/pages/recruiter/Profile"

import AdminDashboard from "@/pages/admin/Dashboard"
import AdminStudents from "@/pages/admin/Students"
import AdminRecruiters from "@/pages/admin/Recruiters"
import AdminJobs from "@/pages/admin/Jobs"
import AdminApplications from "@/pages/admin/Applications"

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student */}
            <Route
              element={
                <Protected role="student">
                  <Layout />
                </Protected>
              }
            >
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/jobs" element={<StudentJobs />} />
              <Route path="/jobs/:id" element={<StudentJobDetail />} />
              <Route path="/applications" element={<StudentApplications />} />
              <Route path="/profile" element={<StudentProfile />} />
              {/* Design-reference paths remain supported for the canonical layouts. */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/jobs" element={<StudentJobs />} />
              <Route path="/student/jobs/:id" element={<StudentJobDetail />} />
              <Route path="/student/applications" element={<StudentApplications />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>

            {/* Recruiter */}
            <Route
              element={
                <Protected role="recruiter">
                  <Layout />
                </Protected>
              }
            >
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
              <Route path="/recruiter/jobs/new" element={<RecruiterJobForm mode="create" />} />
              <Route path="/recruiter/jobs/:id" element={<RecruiterJobDetail />} />
              <Route path="/recruiter/jobs/:id/edit" element={<RecruiterJobForm mode="edit" />} />
              <Route path="/recruiter/applications" element={<RecruiterApplications />} />
              <Route path="/recruiter/applications/:id" element={<RecruiterApplicationDetail />} />
              <Route path="/recruiter/profile" element={<RecruiterProfile />} />
              <Route path="/recruiter/applicants" element={<RecruiterApplications />} />
              <Route path="/recruiter/applicants/:id" element={<RecruiterApplicationDetail />} />
            </Route>

            {/* Admin */}
            <Route
              element={
                <Protected role="admin">
                  <Layout />
                </Protected>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/recruiters" element={<AdminRecruiters />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
