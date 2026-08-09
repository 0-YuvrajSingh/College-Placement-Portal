const request = require("supertest")
const app = require("../app")
const {
  createStudent,
  createRecruiter,
  createJob,
  login,
  authHeader,
  addResume,
} = require("./helpers")

describe("Access control (IDOR & role isolation)", () => {
  it("student cannot access recruiter endpoints", async () => {
    const student = await createStudent({ email: "idor-s1@test.edu" })
    const res = await login(student.user.email)
    const attempts = [
      ["get", "/api/recruiter/profile"],
      ["post", "/api/recruiter/jobs"],
      ["get", "/api/recruiter/jobs"],
    ]
    for (const [method, url] of attempts) {
      const r = await request(app)[method](url).set(authHeader(res.body.data.token))
      expect(r.status).toBe(403)
    }
  })

  it("recruiter cannot access student endpoints", async () => {
    const rec = await createRecruiter({ email: "idor-r1@test.com" })
    const res = await login(rec.user.email)
    const r = await request(app)
      .get("/api/students/me/profile")
      .set(authHeader(res.body.data.token))
    expect(r.status).toBe(403)
  })

  it("recruiter cannot access admin endpoints", async () => {
    const rec = await createRecruiter({ email: "idor-r2@test.com" })
    const res = await login(rec.user.email)
    const r = await request(app)
      .get("/api/admin/dashboard")
      .set(authHeader(res.body.data.token))
    expect(r.status).toBe(403)
  })

  it("student cannot access admin endpoints", async () => {
    const student = await createStudent({ email: "idor-s2@test.edu" })
    const res = await login(student.user.email)
    const r = await request(app)
      .get("/api/admin/students")
      .set(authHeader(res.body.data.token))
    expect(r.status).toBe(403)
  })

  it("student A cannot modify student B's profile (no direct access)", async () => {
    const a = await createStudent({ email: "idor-a@test.edu" })
    await createStudent({ email: "idor-b@test.edu" })
    const res = await login(a.user.email)
    // student profile APIs are self-scoped only; updating requires the /me route
    const r = await request(app)
      .put("/api/students/me/profile")
      .set(authHeader(res.body.data.token))
      .send({ cgpa: 3.0 })
    expect(r.status).toBe(200)
    expect(r.body.data.profile.user).toBe(String(a.user._id))
  })

  it("student A cannot read student B's application or resume", async () => {
    const rec = await createRecruiter({ email: "idor-rec@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const a = await createStudent({ email: "idor-a2@test.edu", cgpa: 9 })
    const b = await createStudent({ email: "idor-b2@test.edu", cgpa: 9 })

    const bres = await login(b.user.email)
    await addResume(bres.body.data.token)
    const appliedB = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(bres.body.data.token))
    const appId = appliedB.body.data.application._id

    const ares = await login(a.user.email)
    const got = await request(app)
      .get(`/api/student/applications/${appId}`)
      .set(authHeader(ares.body.data.token))
    expect(got.status).toBe(404)

    // A cannot reach B's resume through the recruiter download path either
    const recruiter = await createRecruiter({ email: "idor-rec2@test.com" })
    const recruiterRes = await login(recruiter.user.email)
    const resume = await request(app)
      .get(`/api/recruiter/applications/${appId}/resume`)
      .set(authHeader(recruiterRes.body.data.token))
    expect(resume.status).toBe(404)
  })

  it("recruiter A cannot read recruiter B's applicants", async () => {
    const recA = await createRecruiter({ email: "idor-ra@test.com" })
    const jobA = await createJob(recA.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "idor-rs@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    const applied = await request(app)
      .post(`/api/jobs/${jobA._id}/apply`)
      .set(authHeader(sres.body.data.token))
    const appId = applied.body.data.application._id

    const recB = await createRecruiter({ email: "idor-rb@test.com" })
    const bres = await login(recB.user.email)
    const got = await request(app)
      .get(`/api/recruiter/applications/${appId}`)
      .set(authHeader(bres.body.data.token))
    expect(got.status).toBe(404)
  })

  it("unauthenticated requests to protected routes return 401", async () => {
    const urls = [
      ["get", "/api/jobs"],
      ["get", "/api/recruiter/profile"],
      ["get", "/api/admin/dashboard"],
      ["get", "/api/student/applications"],
    ]
    for (const [method, url] of urls) {
      const r = await request(app)[method](url)
      expect(r.status).toBe(401)
    }
  })
})
