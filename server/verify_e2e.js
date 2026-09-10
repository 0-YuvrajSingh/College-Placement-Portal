const request = require("supertest")
const mongoose = require("mongoose")
const path = require("path")
const fs = require("fs")
const app = require("./app")

async function run() {
  console.log("Connecting to MongoDB for E2E verification...")
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placement_portal")
  console.log("Connected successfully.\n")

  const results = []
  function assert(name, condition, extra = "") {
    if (condition) {
      console.log(` PASS: ${name}`)
      results.push({ name, passed: true })
    } else {
      console.error(` FAIL: ${name} ${extra}`)
      results.push({ name, passed: false, extra })
    }
  }

  // 1. Health and public stats
  const healthRes = await request(app).get("/api/health")
  assert("GET /api/health returns 200", healthRes.status === 200 && healthRes.body.success === true)

  const statsRes = await request(app).get("/api/stats")
  assert("GET /api/stats returns 200 with stats", statsRes.status === 200 && statsRes.body.data.totalStudents >= 5)

  // 2. Authentication: Student Login
  const studentLoginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "aarav@college.edu", password: "Student@123" })
  assert("Student login success", studentLoginRes.status === 200 && studentLoginRes.body.data.token)
  const studentToken = studentLoginRes.body.data.token

  // 3. Student Me endpoint
  const studentMeRes = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Student GET /api/auth/me returns profile", studentMeRes.status === 200 && studentMeRes.body.data.user.role === "student")

  // 4. Recruiter Login
  const recruiterLoginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "priya@acme.com", password: "Recruiter@123" })
  assert("Recruiter login success", recruiterLoginRes.status === 200 && recruiterLoginRes.body.data.token)
  const recruiterToken = recruiterLoginRes.body.data.token

  // 5. Admin Login
  const adminLoginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@placeforge.edu", password: "Admin@1234" })
  assert("Admin login success", adminLoginRes.status === 200 && adminLoginRes.body.data.token)
  const adminToken = adminLoginRes.body.data.token

  // 6. Security: Student accessing Admin endpoint -> 403
  const studentAdminAccessRes = await request(app)
    .get("/api/admin/dashboard")
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Student accessing /api/admin/dashboard blocked with 403", studentAdminAccessRes.status === 403)

  // 7. Security: Recruiter accessing Admin endpoint -> 403
  const recruiterAdminAccessRes = await request(app)
    .get("/api/admin/dashboard")
    .set("Authorization", `Bearer ${recruiterToken}`)
  assert("Recruiter accessing /api/admin/dashboard blocked with 403", recruiterAdminAccessRes.status === 403)

  // 8. Security: Invalid password -> 401
  const badLoginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@placeforge.edu", password: "WrongPassword" })
  assert("Invalid password returns 401", badLoginRes.status === 401)

  // 9. Security: Request with invalid JWT -> 401
  const invalidTokenRes = await request(app)
    .get("/api/admin/dashboard")
    .set("Authorization", "Bearer invalid.fake.token")
  assert("Invalid token returns 401", invalidTokenRes.status === 401)

  // 10. Student: View profile
  const profileRes = await request(app)
    .get("/api/students/me/profile")
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Student GET /api/students/me/profile returns profile", profileRes.status === 200 && profileRes.body.data.profile.department === "CSE")

  // 11. Student: Download own resume
  const resumeDownloadRes = await request(app)
    .get("/api/students/me/resume")
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Student download own resume returns 200 PDF", resumeDownloadRes.status === 200 && resumeDownloadRes.body.toString("latin1").includes("%PDF"))

  // 12. Student: Job search by skill "React"
  const skillSearchRes = await request(app)
    .get("/api/jobs?search=React")
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Search jobs by skill 'React' returns matching jobs", skillSearchRes.status === 200 && skillSearchRes.body.data.length > 0 && skillSearchRes.body.data.some(j => j.title === "Software Engineer"))

  // 13. Student: Job detail checks applied flag
  const jobsListRes = await request(app)
    .get("/api/jobs")
    .set("Authorization", `Bearer ${studentToken}`)
  const softwareEngineerJob = jobsListRes.body.data.find(j => j.title === "Software Engineer")
  const jobDetailRes = await request(app)
    .get(`/api/jobs/${softwareEngineerJob._id}`)
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Job detail for applied job returns applied: true", jobDetailRes.status === 200 && jobDetailRes.body.data.applied === true)

  // 14. Student: Prevent duplicate application
  const duplicateApplyRes = await request(app)
    .post(`/api/jobs/${softwareEngineerJob._id}/apply`)
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Duplicate application returns 409", duplicateApplyRes.status === 409)

  // 15. Recruiter: Create a new job
  const newJobRes = await request(app)
    .post("/api/recruiter/jobs")
    .set("Authorization", `Bearer ${recruiterToken}`)
    .send({
      title: "Frontend Engineer (React)",
      description: "Build modern web apps with React and TypeScript.",
      companyName: "Acme Technologies",
      location: "Bengaluru",
      employmentType: "Full-time",
      workMode: "Hybrid",
      salary: { min: 9, max: 16, currency: "LPA" },
      skills: ["React", "TypeScript", "TailwindCSS"],
      eligibility: {
        minimumCgpa: 7,
        eligibleDepartments: ["CSE", "IT"],
        eligibleGraduationYears: [2026],
        requiredSkills: ["React"],
        backlogAllowed: false,
      },
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "OPEN"
    })
  assert("Recruiter create new job returns 201", newJobRes.status === 201 && newJobRes.body.data.job.status === "OPEN")
  const createdJobId = newJobRes.body.data.job._id

  // 16. Student: Apply to new eligible job
  const applyRes = await request(app)
    .post(`/api/jobs/${createdJobId}/apply`)
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Student apply to eligible job returns 201", applyRes.status === 201 && applyRes.body.data.application.status === "APPLIED")

  // 17. Student: View own applications
  const myAppsRes = await request(app)
    .get("/api/student/applications")
    .set("Authorization", `Bearer ${studentToken}`)
  assert("Student GET /api/student/applications returns applications list", myAppsRes.status === 200 && myAppsRes.body.data.length >= 3)

  // 18. Recruiter: View jobs
  const recruiterJobsRes = await request(app)
    .get("/api/recruiter/jobs")
    .set("Authorization", `Bearer ${recruiterToken}`)
  assert("Recruiter GET /api/recruiter/jobs returns own jobs", recruiterJobsRes.status === 200 && recruiterJobsRes.body.data.length >= 2)

  // 19. Recruiter: View applicants for softwareEngineer job
  const applicantsRes = await request(app)
    .get(`/api/recruiter/jobs/${softwareEngineerJob._id}/applications`)
    .set("Authorization", `Bearer ${recruiterToken}`)
  assert("Recruiter view applicants returns applications with studentProfile", applicantsRes.status === 200 && applicantsRes.body.data.length > 0)
  const appToUpdate = applicantsRes.body.data.find(a => a.status === "APPLIED") || applicantsRes.body.data[0]

  // 20. Recruiter: Download applicant resume
  const appResumeRes = await request(app)
    .get(`/api/recruiter/applications/${appToUpdate._id}/resume`)
    .set("Authorization", `Bearer ${recruiterToken}`)
  assert("Recruiter download applicant resume returns 200 PDF", appResumeRes.status === 200 && appResumeRes.body.toString("latin1").includes("%PDF"))

  // 21. Recruiter: Update applicant status
  const updateStatusRes = await request(app)
    .patch(`/api/recruiter/applications/${appToUpdate._id}/status`)
    .set("Authorization", `Bearer ${recruiterToken}`)
    .send({ status: "SHORTLISTED", remarks: "Shortlisted for Round 1 interview" })
  assert("Recruiter update applicant status returns 200", updateStatusRes.status === 200 && updateStatusRes.body.data.application.status === "SHORTLISTED")

  // 22. Security: Recruiter IDOR check (Rajesh trying to access Priya's job application)
  const rajeshLoginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "rajesh@infotech.com", password: "Recruiter@123" })
  const rajeshToken = rajeshLoginRes.body.data.token

  const idorRes = await request(app)
    .get(`/api/recruiter/applications/${appToUpdate._id}`)
    .set("Authorization", `Bearer ${rajeshToken}`)
  assert("Recruiter accessing another recruiter's application blocked with 404", idorRes.status === 404)

  // 23. Admin: Dashboard stats
  const adminDashRes = await request(app)
    .get("/api/admin/dashboard")
    .set("Authorization", `Bearer ${adminToken}`)
  assert("Admin dashboard stats returns expected counts", adminDashRes.status === 200 && adminDashRes.body.data.totalStudents >= 5 && adminDashRes.body.data.totalJobs >= 8)

  // 24. Admin: List and toggle student active status
  const adminStudentsRes = await request(app)
    .get("/api/admin/students")
    .set("Authorization", `Bearer ${adminToken}`)
  assert("Admin list students returns students with profiles", adminStudentsRes.status === 200 && adminStudentsRes.body.data.length > 0)
  const targetStudent = adminStudentsRes.body.data[0]

  const toggleStudentRes = await request(app)
    .patch(`/api/admin/students/${targetStudent._id}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ isActive: false })
  assert("Admin deactivate student returns 200", toggleStudentRes.status === 200 && toggleStudentRes.body.data.user.isActive === false)

  // Re-activate student
  await request(app)
    .patch(`/api/admin/students/${targetStudent._id}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ isActive: true })

  // 25. Admin: List and toggle recruiter approval
  const adminRecruitersRes = await request(app)
    .get("/api/admin/recruiters")
    .set("Authorization", `Bearer ${adminToken}`)
  assert("Admin list recruiters returns recruiters with job counts", adminRecruitersRes.status === 200 && adminRecruitersRes.body.data.length >= 3)

  // 26. Admin: List all applications and download resume
  const adminAppsRes = await request(app)
    .get("/api/admin/applications")
    .set("Authorization", `Bearer ${adminToken}`)
  assert("Admin list all applications returns applications", adminAppsRes.status === 200 && adminAppsRes.body.data.length > 0)

  const adminResumeRes = await request(app)
    .get(`/api/admin/applications/${appToUpdate._id}/resume`)
    .set("Authorization", `Bearer ${adminToken}`)
  assert("Admin download application resume returns 200 PDF", adminResumeRes.status === 200 && adminResumeRes.body.toString("latin1").includes("%PDF"))

  // 27. Admin: View audit logs
  const auditLogsRes = await request(app)
    .get("/api/admin/audit-logs")
    .set("Authorization", `Bearer ${adminToken}`)
  assert("Admin audit logs recorded student status change", auditLogsRes.status === 200 && auditLogsRes.body.data.some(l => l.action === "student.status_changed"))

  // Summary
  console.log("\n==========================================")
  const failed = results.filter(r => !r.passed)
  if (failed.length === 0) {
    console.log(`ALL ${results.length} E2E TESTS PASSED SUCCESSFULLY!`)
  } else {
    console.error(`${failed.length} OF ${results.length} TESTS FAILED:`)
    failed.forEach(f => console.error(` - ${f.name}: ${f.extra}`))
  }
  console.log("==========================================\n")

  await mongoose.disconnect()
  process.exit(failed.length === 0 ? 0 : 1)
}

run().catch(err => {
  console.error("E2E script crashed:", err)
  process.exit(1)
})
