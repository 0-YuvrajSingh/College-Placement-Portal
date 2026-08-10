const request = require("supertest")
const app = require("../app")
const {
  createRecruiter,
  createJob,
  createStudent,
  login,
  authHeader,
  addResume,
} = require("./helpers")

const setupApplied = async () => {
  const rec = await createRecruiter({ email: "app-rec@test.com" })
  const job = await createJob(rec.user._id, { status: "OPEN" })
  const student = await createStudent({ email: "myst@test.edu", cgpa: 9 })
  const res = await login(student.user.email)
  const token = res.body.data.token
  await addResume(token)
  const applied = await request(app)
    .post(`/api/jobs/${job._id}/apply`)
    .set(authHeader(token))
  return { student, token, applicationId: applied.body.data.application._id, rec }
}

describe("Student application management", () => {
  it("lists own applications", async () => {
    const { token } = await setupApplied()
    const res = await request(app).get("/api/student/applications").set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(1)
    expect(res.body.pagination.total).toBe(1)
  })

  it("gets own application detail", async () => {
    const { token, applicationId } = await setupApplied()
    const res = await request(app)
      .get(`/api/student/applications/${applicationId}`)
      .set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body.data.application.status).toBe("APPLIED")
  })

  it("cannot access another student's application", async () => {
    const { applicationId } = await setupApplied()
    const other = await createStudent({ email: "other@test.edu" })
    const res = await login(other.user.email)
    const got = await request(app)
      .get(`/api/student/applications/${applicationId}`)
      .set(authHeader(res.body.data.token))
    expect(got.status).toBe(404)

    const withdrawn = await request(app)
      .patch(`/api/student/applications/${applicationId}/withdraw`)
      .set(authHeader(res.body.data.token))
    expect(withdrawn.status).toBe(404)
  })

  it("withdraws an application in APPLIED state", async () => {
    const { token, applicationId } = await setupApplied()
    const res = await request(app)
      .patch(`/api/student/applications/${applicationId}/withdraw`)
      .set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body.data.application.status).toBe("WITHDRAWN")
    expect(res.body.data.application.withdrawnAt).toBeDefined()
  })

  it("cannot withdraw an application that is already decided", async () => {
    const { token, applicationId, rec } = await setupApplied()
    const rres = await login(rec.user.email)
    const headers = authHeader(rres.body.data.token)
    await request(app)
      .patch(`/api/recruiter/applications/${applicationId}/status`)
      .set(headers)
      .send({ status: "SHORTLISTED" })
    await request(app)
      .patch(`/api/recruiter/applications/${applicationId}/status`)
      .set(headers)
      .send({ status: "SELECTED" })

    const withdraw = await request(app)
      .patch(`/api/student/applications/${applicationId}/withdraw`)
      .set(authHeader(token))
    expect(withdraw.status).toBe(400)
    expect(withdraw.body.code).toBe("CANNOT_WITHDRAW")
  })

  it("cannot withdraw twice", async () => {
    const { token, applicationId } = await setupApplied()
    await request(app)
      .patch(`/api/student/applications/${applicationId}/withdraw`)
      .set(authHeader(token))
    const again = await request(app)
      .patch(`/api/student/applications/${applicationId}/withdraw`)
      .set(authHeader(token))
    expect(again.status).toBe(400)
  })

  it("snapshots the resume so later replacements do not break downloads", async () => {
    const rec = await createRecruiter({ email: "snap-rec@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "snap-st@test.edu", cgpa: 9 })
    const res = await login(student.user.email)
    const token = res.body.data.token
    const headers = authHeader(token)

    await addResume(token)
    const applied = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(headers)
    const appId = applied.body.data.application._id

    // Replace the profile resume AFTER applying.
    await request(app)
      .post("/api/students/me/resume")
      .set(headers)
      .attach("resume", Buffer.from("%PDF-1.4 replacement resume"), "resume.pdf")

    const download = await request(app)
      .get(`/api/recruiter/applications/${appId}/resume`)
      .set(authHeader((await login(rec.user.email)).body.data.token))
    expect(download.status).toBe(200)
  })

  it("rejects a duplicate application attempt", async () => {
    const rec = await createRecruiter({ email: "dup-rec@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "dup-st@test.edu", cgpa: 9 })
    const res = await login(student.user.email)
    const headers = authHeader(res.body.data.token)
    await addResume(res.body.data.token)

    const first = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(headers)
    expect(first.status).toBe(201)

    const second = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(headers)
    expect(second.status).toBe(409)
    expect(second.body.code).toBe("ALREADY_APPLIED")
  })
})
