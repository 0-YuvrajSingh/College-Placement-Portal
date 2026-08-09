const request = require("supertest")
const app = require("../app")
const {
  createAdmin,
  createStudent,
  createRecruiter,
  createJob,
  login,
  authHeader,
  addResume,
} = require("./helpers")

describe("Admin", () => {
  let adminToken

  beforeEach(async () => {
    const admin = await createAdmin()
    const res = await login(admin.email)
    adminToken = res.body.data.token
  })

  it("returns dashboard statistics", async () => {
    const student = await createStudent({ email: "dash-s@test.edu" })
    const rec = await createRecruiter({ email: "dash-r@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))

    const res = await request(app)
      .get("/api/admin/dashboard")
      .set(authHeader(adminToken))
    expect(res.status).toBe(200)
    expect(res.body.data.totalStudents).toBe(1)
    expect(res.body.data.activeStudents).toBe(1)
    expect(res.body.data.totalRecruiters).toBe(1)
    expect(res.body.data.totalJobs).toBe(1)
    expect(res.body.data.openJobs).toBe(1)
    expect(res.body.data.totalApplications).toBe(1)
  })

  it("lists students and deactivates one (blocks their login)", async () => {
    const student = await createStudent({ email: "adm-s@test.edu" })

    const list = await request(app).get("/api/admin/students").set(authHeader(adminToken))
    expect(list.status).toBe(200)
    expect(list.body.data.length).toBe(1)
    expect(list.body.data[0].studentProfile).toBeDefined()

    const deactivate = await request(app)
      .patch(`/api/admin/students/${student.user._id}/status`)
      .set(authHeader(adminToken))
      .send({ isActive: false })
    expect(deactivate.status).toBe(200)
    expect(deactivate.body.data.user.isActive).toBe(false)

    const loginAttempt = await request(app)
      .post("/api/auth/login")
      .send({ email: student.user.email, password: "secret123" })
    expect(loginAttempt.status).toBe(403)
  })

  it("lists recruiters and toggles approval", async () => {
    const rec = await createRecruiter({ email: "adm-r@test.com", isApproved: false })

    const list = await request(app).get("/api/admin/recruiters").set(authHeader(adminToken))
    expect(list.status).toBe(200)
    expect(list.body.data.length).toBe(1)

    const approve = await request(app)
      .patch(`/api/admin/recruiters/${rec.user._id}/status`)
      .set(authHeader(adminToken))
      .send({ isActive: false, isApproved: true })
    expect(approve.status).toBe(200)
    expect(approve.body.data.user.isActive).toBe(false)
  })

  it("lists jobs and changes their status", async () => {
    const rec = await createRecruiter({ email: "adm-r2@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })

    const list = await request(app).get("/api/admin/jobs").set(authHeader(adminToken))
    expect(list.status).toBe(200)
    expect(list.body.data.length).toBe(1)

    const close = await request(app)
      .patch(`/api/admin/jobs/${job._id}/status`)
      .set(authHeader(adminToken))
      .send({ status: "CLOSED" })
    expect(close.status).toBe(200)
    expect(close.body.data.job.status).toBe("CLOSED")
  })

  it("lists applications", async () => {
    const student = await createStudent({ email: "adm-a@test.edu" })
    const rec = await createRecruiter({ email: "adm-a-r@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))

    const res = await request(app)
      .get("/api/admin/applications")
      .set(authHeader(adminToken))
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(1)
    expect(res.body.data[0].student.name).toBe("Test Student")
  })

  it("rejects non-admin access to admin endpoints", async () => {
    const student = await createStudent({ email: "not-admin@test.edu" })
    const res = await login(student.user.email)
    const attempt = await request(app)
      .get("/api/admin/dashboard")
      .set(authHeader(res.body.data.token))
    expect(attempt.status).toBe(403)
  })

  it("toggles a student's placed status and reflects it in dashboard stats", async () => {
    const student = await createStudent({ email: "adm-placed@test.edu" })

    const placed = await request(app)
      .patch(`/api/admin/students/${student.user._id}/status`)
      .set(authHeader(adminToken))
      .send({ isActive: true, isPlaced: true })
    expect(placed.status).toBe(200)

    const dash = await request(app)
      .get("/api/admin/dashboard")
      .set(authHeader(adminToken))
    expect(dash.body.data.placedStudents).toBe(1)

    const list = await request(app)
      .get("/api/admin/students?isPlaced=true")
      .set(authHeader(adminToken))
    expect(list.body.data.length).toBe(1)
    expect(list.body.data[0].studentProfile.isPlaced).toBe(true)
  })
})

describe("Public stats", () => {
  it("returns aggregate platform statistics without authentication", async () => {
    await createStudent({ email: "pub-st@test.edu" })
    await createRecruiter({ email: "pub-r@test.com" })

    const res = await request(app).get("/api/stats")
    expect(res.status).toBe(200)
    expect(res.body.data.totalStudents).toBe(1)
    expect(res.body.data.totalRecruiters).toBe(1)
    expect(typeof res.body.data.placementRate).toBe("number")
  })
})
