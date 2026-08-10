const request = require("supertest")
const app = require("../app")
const Recruiter = require("../models/Recruiter")
const {
  createRecruiter,
  createJob,
  createStudent,
  login,
  authHeader,
  addResume,
} = require("./helpers")

describe("Recruiter profile & jobs", () => {
  it("GET profile returns 404 before creation, PUT upserts", async () => {
    const rec = await createRecruiter({ email: "rp@test.com" })
    const res = await login(rec.user.email)
    const headers = authHeader(res.body.data.token)

    const created = await request(app)
      .put("/api/recruiter/profile")
      .set(headers)
      .send({ companyName: "Updated Corp", location: "Pune", contactPhone: "9876501234" })
    expect(created.status).toBe(200)
    expect(created.body.data.profile.companyName).toBe("Updated Corp")

    const got = await request(app).get("/api/recruiter/profile").set(headers)
    expect(got.status).toBe(200)
    expect(got.body.data.profile.location).toBe("Pune")
  })

  it("creates a job defaulting to DRAFT", async () => {
    const rec = await createRecruiter({ email: "rj1@test.com" })
    const res = await login(rec.user.email)
    const created = await request(app)
      .post("/api/recruiter/jobs")
      .set(authHeader(res.body.data.token))
      .send({
        title: "New Job",
        description: "A brand new role",
        companyName: "Test Corp",
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      })
    expect(created.status).toBe(201)
    expect(created.body.data.job.status).toBe("DRAFT")
  })

  it("rejects past application deadlines", async () => {
    const rec = await createRecruiter({ email: "rj2@test.com" })
    const res = await login(rec.user.email)
    const created = await request(app)
      .post("/api/recruiter/jobs")
      .set(authHeader(res.body.data.token))
      .send({
        title: "Bad",
        description: "d",
        companyName: "C",
        applicationDeadline: new Date(Date.now() - 1000).toISOString(),
      })
    expect(created.status).toBe(400)
    expect(created.body.code).toBe("INVALID_DEADLINE")
  })

  it("rejects invalid job payloads with 422", async () => {
    const rec = await createRecruiter({ email: "rj2b@test.com" })
    const res = await login(rec.user.email)
    const created = await request(app)
      .post("/api/recruiter/jobs")
      .set(authHeader(res.body.data.token))
      .send({ title: "", description: "", companyName: "", applicationDeadline: "not-a-date" })
    expect(created.status).toBe(422)
  })

  it("opens a job via the status endpoint", async () => {
    const rec = await createRecruiter({ email: "rj3@test.com" })
    const res = await login(rec.user.email)
    const job = await createJob(rec.user._id, { status: "DRAFT" })
    const open = await request(app)
      .patch(`/api/recruiter/jobs/${job._id}/status`)
      .set(authHeader(res.body.data.token))
      .send({ status: "OPEN" })
    expect(open.status).toBe(200)
    expect(open.body.data.job.status).toBe("OPEN")
  })

  it("rejects invalid job status transitions", async () => {
    const rec = await createRecruiter({ email: "rj4@test.com" })
    const res = await login(rec.user.email)
    const job = await createJob(rec.user._id, { status: "CLOSED" })
    const reopen = await request(app)
      .patch(`/api/recruiter/jobs/${job._id}/status`)
      .set(authHeader(res.body.data.token))
      .send({ status: "OPEN" })
    expect(reopen.status).toBe(400)
    expect(reopen.body.code).toBe("INVALID_STATUS_TRANSITION")
  })

  it("cannot access another recruiter's job", async () => {
    const recA = await createRecruiter({ email: "rj5@test.com" })
    const recB = await createRecruiter({ email: "rj6@test.com" })
    const job = await createJob(recA.user._id, { status: "OPEN" })
    const res = await login(recB.user.email)
    const headers = authHeader(res.body.data.token)

    const got = await request(app).get(`/api/recruiter/jobs/${job._id}`).set(headers)
    expect(got.status).toBe(404)

    const updated = await request(app)
      .put(`/api/recruiter/jobs/${job._id}`)
      .set(headers)
      .send({ title: "Hijacked" })
    expect(updated.status).toBe(404)

    const del = await request(app).delete(`/api/recruiter/jobs/${job._id}`).set(headers)
    expect(del.status).toBe(404)
  })

  it("cannot delete a job that has applications", async () => {
    const rec = await createRecruiter({ email: "rj7@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "rs@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))

    const rres = await login(rec.user.email)
    const del = await request(app)
      .delete(`/api/recruiter/jobs/${job._id}`)
      .set(authHeader(rres.body.data.token))
    expect(del.status).toBe(400)
    expect(del.body.code).toBe("JOB_HAS_APPLICATIONS")
  })
})

describe("Recruiter approval gating", () => {
  it("blocks an unapproved recruiter from creating jobs", async () => {
    const rec = await createRecruiter({ email: "approve-pend@test.com", isApproved: false })
    const res = await login(rec.user.email)
    const created = await request(app)
      .post("/api/recruiter/jobs")
      .set(authHeader(res.body.data.token))
      .send({
        title: "Pending Job",
        description: "Should not create",
        companyName: "Test Corp",
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      })
    expect(created.status).toBe(403)
    expect(created.body.code).toBe("RECRUITER_NOT_APPROVED")
  })

  it("allows an approved recruiter to create jobs", async () => {
    const rec = await createRecruiter({ email: "approve-ok@test.com", isApproved: true })
    const res = await login(rec.user.email)
    const created = await request(app)
      .post("/api/recruiter/jobs")
      .set(authHeader(res.body.data.token))
      .send({
        title: "Approved Job",
        description: "Should create",
        companyName: "Test Corp",
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      })
    expect(created.status).toBe(201)
  })

  it("unapproved recruiters can still read their own profile", async () => {
    const rec = await createRecruiter({ email: "approve-pro@test.com", isApproved: false })
    const res = await login(rec.user.email)
    const profile = await request(app)
      .get("/api/recruiter/profile")
      .set(authHeader(res.body.data.token))
    expect(profile.status).toBe(200)
    expect(profile.body.data.profile.isApproved).toBe(false)
  })

  it("unapproved recruiters cannot update application statuses", async () => {
    const rec = await createRecruiter({ email: "approve-app@test.com", isApproved: true })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "approve-st@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    const applied = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))
    const appId = applied.body.data.application._id

    await Recruiter.updateOne({ user: rec.user._id }, { isApproved: false })
    const rres = await login(rec.user.email)
    const update = await request(app)
      .patch(`/api/recruiter/applications/${appId}/status`)
      .set(authHeader(rres.body.data.token))
      .send({ status: "SHORTLISTED" })
    expect(update.status).toBe(403)
    expect(update.body.code).toBe("RECRUITER_NOT_APPROVED")
  })
})

describe("Recruiter applicant management", () => {
  it("lists applicants only for own jobs", async () => {
    const rec = await createRecruiter({ email: "rj8@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "st1@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))

    const otherRec = await createRecruiter({ email: "rj9@test.com" })
    const ores = await login(otherRec.user.email)
    const forbidden = await request(app)
      .get(`/api/recruiter/jobs/${job._id}/applications`)
      .set(authHeader(ores.body.data.token))
    expect(forbidden.status).toBe(404)

    const rres = await login(rec.user.email)
    const list = await request(app)
      .get(`/api/recruiter/jobs/${job._id}/applications`)
      .set(authHeader(rres.body.data.token))
    expect(list.status).toBe(200)
    expect(list.body.data.length).toBe(1)
    expect(list.body.data[0].studentProfile.cgpa).toBe(9)
  })

  it("moves an application through valid transitions", async () => {
    const rec = await createRecruiter({ email: "rj10@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "st2@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    const applied = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))
    const appId = applied.body.data.application._id

    const rres = await login(rec.user.email)
    const headers = authHeader(rres.body.data.token)

    const short = await request(app)
      .patch(`/api/recruiter/applications/${appId}/status`)
      .set(headers)
      .send({ status: "SHORTLISTED", remarks: "Good profile" })
    expect(short.status).toBe(200)
    expect(short.body.data.application.status).toBe("SHORTLISTED")

    const selected = await request(app)
      .patch(`/api/recruiter/applications/${appId}/status`)
      .set(headers)
      .send({ status: "SELECTED" })
    expect(selected.status).toBe(200)
    expect(selected.body.data.application.status).toBe("SELECTED")
  })

  it("rejects skipping states (APPLIED -> SELECTED)", async () => {
    const rec = await createRecruiter({ email: "rj11@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "st3@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    const applied = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))
    const appId = applied.body.data.application._id

    const rres = await login(rec.user.email)
    const skip = await request(app)
      .patch(`/api/recruiter/applications/${appId}/status`)
      .set(authHeader(rres.body.data.token))
      .send({ status: "SELECTED" })
    expect(skip.status).toBe(400)
    expect(skip.body.code).toBe("INVALID_STATUS_TRANSITION")
  })

  it("rejects invalid transitions from a final state", async () => {
    const rec = await createRecruiter({ email: "rj12@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "st4@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    const applied = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))
    const appId = applied.body.data.application._id

    const rres = await login(rec.user.email)
    const headers = authHeader(rres.body.data.token)
    await request(app)
      .patch(`/api/recruiter/applications/${appId}/status`)
      .set(headers)
      .send({ status: "REJECTED" })
    const rejectThenSelect = await request(app)
      .patch(`/api/recruiter/applications/${appId}/status`)
      .set(headers)
      .send({ status: "SELECTED" })
    expect(rejectThenSelect.status).toBe(400)
  })

  it("cannot update another recruiter's application", async () => {
    const recA = await createRecruiter({ email: "rj13@test.com" })
    const job = await createJob(recA.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "st5@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    const applied = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))
    const appId = applied.body.data.application._id

    const recB = await createRecruiter({ email: "rj14@test.com" })
    const bres = await login(recB.user.email)
    const update = await request(app)
      .patch(`/api/recruiter/applications/${appId}/status`)
      .set(authHeader(bres.body.data.token))
      .send({ status: "SHORTLISTED" })
    expect(update.status).toBe(404)
  })

  it("blocks a recruiter from downloading another recruiter's applicant resume", async () => {
    const recA = await createRecruiter({ email: "rj15@test.com" })
    const job = await createJob(recA.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "st6@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    const applied = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(sres.body.data.token))
    const appId = applied.body.data.application._id

    const recB = await createRecruiter({ email: "rj16@test.com" })
    const bres = await login(recB.user.email)
    const resume = await request(app)
      .get(`/api/recruiter/applications/${appId}/resume`)
      .set(authHeader(bres.body.data.token))
    expect(resume.status).toBe(404)
  })
})

describe("Recruiter stats & cross-job applicants", () => {
  const seedApplicant = async (rec, email) => {
    const student = await createStudent({ email, cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    await request(app)
      .post(`/api/jobs/${rec.job._id}/apply`)
      .set(authHeader(sres.body.data.token))
  }

  it("includes applicant counts when listing own jobs", async () => {
    const rec = await createRecruiter({ email: "st8@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "st8s@test.edu", cgpa: 9 })
    const sres = await login(student.user.email)
    await addResume(sres.body.data.token)
    await request(app).post(`/api/jobs/${job._id}/apply`).set(authHeader(sres.body.data.token))

    const rres = await login(rec.user.email)
    const list = await request(app).get("/api/recruiter/jobs").set(authHeader(rres.body.data.token))
    expect(list.status).toBe(200)
    expect(list.body.data[0].applicantCount).toBe(1)
  })

  it("lists applicants across all own postings with filters", async () => {
    const rec = await createRecruiter({ email: "st9@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    await seedApplicant({ job }, "st9s@test.edu")

    const rres = await login(rec.user.email)
    const headers = authHeader(rres.body.data.token)

    const all = await request(app).get("/api/recruiter/applications").set(headers)
    expect(all.status).toBe(200)
    expect(all.body.data.length).toBe(1)
    expect(all.body.data[0].studentProfile).toBeDefined()

    const filtered = await request(app)
      .get("/api/recruiter/applications?status=APPLIED")
      .set(headers)
    expect(filtered.status).toBe(200)
    expect(filtered.body.data.length).toBe(1)

    const empty = await request(app)
      .get("/api/recruiter/applications?status=SELECTED")
      .set(headers)
    expect(empty.body.data.length).toBe(0)

    const searched = await request(app)
      .get("/api/recruiter/applications?search=st9s")
      .set(headers)
    expect(searched.status).toBe(200)
    expect(searched.body.data.length).toBe(1)
  })

  it("does not expose another recruiter's applications in the cross-job list", async () => {
    const recA = await createRecruiter({ email: "st10@test.com" })
    const job = await createJob(recA.user._id, { status: "OPEN" })
    await seedApplicant({ job }, "st10s@test.edu")

    const recB = await createRecruiter({ email: "st10b@test.com" })
    const bres = await login(recB.user.email)
    const list = await request(app)
      .get("/api/recruiter/applications")
      .set(authHeader(bres.body.data.token))
    expect(list.status).toBe(200)
    expect(list.body.data.length).toBe(0)
  })

  it("returns recruiter dashboard statistics", async () => {
    const rec = await createRecruiter({ email: "st11@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const closing = await createJob(rec.user._id, {
      title: "Closing Soon",
      status: "OPEN",
      applicationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    })
    await seedApplicant({ job }, "st11s@test.edu")

    const rres = await login(rec.user.email)
    const stats = await request(app)
      .get("/api/recruiter/stats")
      .set(authHeader(rres.body.data.token))
    expect(stats.status).toBe(200)
    expect(stats.body.data.totalJobs).toBe(2)
    expect(stats.body.data.activeJobs).toBe(2)
    expect(stats.body.data.closingSoon).toBe(1)
    expect(stats.body.data.totalApplicants).toBe(1)
    expect(stats.body.data.applied).toBe(1)
  })
})
