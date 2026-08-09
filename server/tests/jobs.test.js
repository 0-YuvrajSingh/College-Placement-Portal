const request = require("supertest")
const app = require("../app")
const Application = require("../models/Application")
const {
  createUser,
  createStudent,
  createRecruiter,
  createJob,
  login,
  authHeader,
  addResume,
} = require("./helpers")

describe("Job discovery", () => {
  let recruiterUser
  let token

  beforeEach(async () => {
    const rec = await createRecruiter({ email: "disc-rec@test.com" })
    recruiterUser = rec.user
    await createJob(recruiterUser._id, { title: "Alpha Job", status: "OPEN" })
    await createJob(recruiterUser._id, { title: "Beta Job", status: "DRAFT" })
    await createJob(recruiterUser._id, { title: "Gamma Job", status: "CLOSED" })
    await createJob(recruiterUser._id, {
      title: "Delta Job",
      status: "OPEN",
      applicationDeadline: new Date(Date.now() - 60 * 60 * 1000),
    })
    const student = await createStudent({ email: "disc@test.edu" })
    const res = await login("disc@test.edu")
    token = res.body.data.token
  })

  it("lists only open, non-expired jobs", async () => {
    const res = await request(app).get("/api/jobs").set(authHeader(token))
    expect(res.status).toBe(200)
    const titles = res.body.data.map((j) => j.title)
    expect(titles).toContain("Alpha Job")
    expect(titles).not.toContain("Beta Job")
    expect(titles).not.toContain("Gamma Job")
    expect(titles).not.toContain("Delta Job")
  })

  it("supports search and pagination metadata", async () => {
    const res = await request(app)
      .get("/api/jobs?search=Alpha&page=1&limit=10")
      .set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(1)
    expect(res.body.pagination.total).toBe(1)
    expect(res.body.pagination.totalPages).toBe(1)
  })

  it("does not expose non-open jobs by id to students", async () => {
    const hidden = await createJob(recruiterUser._id, { title: "Hidden", status: "DRAFT" })
    const res = await request(app)
      .get(`/api/jobs/${hidden._id}`)
      .set(authHeader(token))
    expect(res.status).toBe(400)
    expect(res.body.code).toBe("JOB_NOT_OPEN")
  })

  it("annotates jobs with eligibility, applied and applicant counts", async () => {
    const student = await createStudent({ email: "flags@test.edu", cgpa: 9 })
    const sres = await login("flags@test.edu")
    const studentToken = sres.body.data.token
    await addResume(studentToken)

    const job = await createJob(recruiterUser._id, { status: "OPEN" })
    const hard = await createJob(recruiterUser._id, {
      title: "Impossible Job",
      status: "OPEN",
      minimumCgpa: 9.9,
    })
    await request(app).post(`/api/jobs/${job._id}/apply`).set(authHeader(studentToken))

    const res = await request(app).get("/api/jobs").set(authHeader(studentToken))
    expect(res.status).toBe(200)

    const applied = res.body.data.find((j) => String(j._id) === String(job._id))
    expect(applied).toBeDefined()
    expect(applied.applied).toBe(true)
    expect(applied.applicantCount).toBe(1)
    expect(applied.isEligible).toBe(true)

    const impossible = res.body.data.find((j) => j.title === "Impossible Job")
    expect(impossible).toBeDefined()
    expect(impossible.isEligible).toBe(false)
    expect(impossible.applied).toBe(false)
  })

  it("sorts jobs by salary when requested", async () => {
    await createJob(recruiterUser._id, {
      title: "Low Pay",
      status: "OPEN",
      salary: { min: 4, max: 6, currency: "LPA" },
    })
    await createJob(recruiterUser._id, {
      title: "High Pay",
      status: "OPEN",
      salary: { min: 20, max: 30, currency: "LPA" },
    })

    const res = await request(app)
      .get("/api/jobs?sortBy=salary")
      .set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body.data[0].title).toBe("High Pay")
  })

  it("returns eligibility info for students on job detail", async () => {
    const job = await createJob(recruiterUser._id, {
      title: "Tough Job",
      status: "OPEN",
      minimumCgpa: 9.9,
    })
    const res = await request(app)
      .get(`/api/jobs/${job._id}`)
      .set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body.data.isEligible).toBe(false)
    expect(res.body.data.eligibilityReasons.length).toBeGreaterThan(0)
  })

  it("supports department and minCgpa filters", async () => {
    await createJob(recruiterUser._id, {
      title: "Civil Job",
      status: "OPEN",
      eligibleDepartments: ["Civil"],
      minimumCgpa: 6,
    })

    const dept = await request(app)
      .get("/api/jobs?department=Computer%20Science")
      .set(authHeader(token))
    expect(dept.body.data.every((j) => j.title !== "Civil Job")).toBe(true)

    const cgpa = await request(app)
      .get("/api/jobs?minCgpa=6")
      .set(authHeader(token))
    expect(cgpa.body.data.length).toBeGreaterThan(0)
  })

  it("filters to eligible jobs when eligible=true", async () => {
    await createJob(recruiterUser._id, { title: "Too Hard", status: "OPEN", minimumCgpa: 9.9 })
    const res = await request(app)
      .get("/api/jobs?eligible=true")
      .set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body.data.every((j) => j.title !== "Too Hard")).toBe(true)
  })
})

describe("Applying to jobs", () => {
  it("applies successfully with a resume when eligible", async () => {
    const rec = await createRecruiter({ email: "app-rec@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    await createStudent({ email: "app1@test.edu", cgpa: 9 })
    const res = await login("app1@test.edu")
    const token = res.body.data.token
    await addResume(token)

    const apply = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(token))
    expect(apply.status).toBe(201)
    expect(apply.body.data.application.status).toBe("APPLIED")
    expect(apply.body.data.application.resumeSnapshot.originalName).toBe("resume.pdf")
  })

  it("blocks duplicate applications with 409", async () => {
    const rec = await createRecruiter({ email: "app-rec2@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    await createStudent({ email: "app2@test.edu", cgpa: 9 })
    const res = await login("app2@test.edu")
    const token = res.body.data.token
    await addResume(token)

    await request(app).post(`/api/jobs/${job._id}/apply`).set(authHeader(token))
    const dup = await request(app).post(`/api/jobs/${job._id}/apply`).set(authHeader(token))
    expect(dup.status).toBe(409)
    expect(dup.body.code).toBe("ALREADY_APPLIED")
  })

  it("enforces uniqueness at the database level", async () => {
    const rec = await createRecruiter({ email: "app-rec3@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const student = await createStudent({ email: "app3@test.edu" })

    await Application.create({ student: student.user._id, job: job._id, recruiter: rec.user._id })
    await expect(
      Application.create({ student: student.user._id, job: job._id, recruiter: rec.user._id }),
    ).rejects.toMatchObject({ code: 11000 })
  })

  it("blocks ineligible students with reasons", async () => {
    const rec = await createRecruiter({ email: "app-rec4@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN", minimumCgpa: 9.9 })
    await createStudent({ email: "app4@test.edu", cgpa: 6 })
    const res = await login("app4@test.edu")
    const token = res.body.data.token
    await addResume(token)

    const apply = await request(app).post(`/api/jobs/${job._id}/apply`).set(authHeader(token))
    expect(apply.status).toBe(400)
    expect(apply.body.code).toBe("NOT_ELIGIBLE")
    expect(apply.body.details.length).toBeGreaterThan(0)
  })

  it("requires a resume before applying", async () => {
    const rec = await createRecruiter({ email: "app-rec5@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    await createStudent({ email: "app5@test.edu", cgpa: 9 })
    const res = await login("app5@test.edu")

    const apply = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(res.body.data.token))
    expect(apply.status).toBe(400)
    expect(apply.body.code).toBe("RESUME_REQUIRED")
  })

  it("blocks applications to closed jobs", async () => {
    const rec = await createRecruiter({ email: "app-rec6@test.com" })
    const job = await createJob(rec.user._id, { status: "CLOSED" })
    await createStudent({ email: "app6@test.edu", cgpa: 9 })
    const res = await login("app6@test.edu")
    const token = res.body.data.token
    await addResume(token)

    const apply = await request(app).post(`/api/jobs/${job._id}/apply`).set(authHeader(token))
    expect(apply.status).toBe(400)
    expect(apply.body.code).toBe("JOB_CLOSED")
  })

  it("blocks applications after the deadline", async () => {
    const rec = await createRecruiter({ email: "app-rec7@test.com" })
    const job = await createJob(rec.user._id, {
      status: "OPEN",
      applicationDeadline: new Date(Date.now() - 60 * 60 * 1000),
    })
    await createStudent({ email: "app7@test.edu", cgpa: 9 })
    const res = await login("app7@test.edu")
    const token = res.body.data.token
    await addResume(token)

    const apply = await request(app).post(`/api/jobs/${job._id}/apply`).set(authHeader(token))
    expect(apply.status).toBe(400)
    expect(apply.body.code).toBe("APPLICATION_DEADLINE_PASSED")
  })

  it("does not allow recruiters to apply", async () => {
    const rec = await createRecruiter({ email: "app-rec8@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const otherRec = await createRecruiter({ email: "app-rec8b@test.com" })
    const res = await login(otherRec.user.email)

    const apply = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set(authHeader(res.body.data.token))
    expect(apply.status).toBe(403)
  })

  it("does not allow students to apply without a profile", async () => {
    const rec = await createRecruiter({ email: "app-rec9@test.com" })
    const job = await createJob(rec.user._id, { status: "OPEN" })
    const user = await createUser({ name: "No Profile", email: "app9@test.edu", role: "student" })
    const res = await login(user.email)
    const token = res.body.data.token
    await addResume(token)

    const apply = await request(app).post(`/api/jobs/${job._id}/apply`).set(authHeader(token))
    expect(apply.status).toBe(400)
    expect(apply.body.code).toBe("PROFILE_REQUIRED")
  })
})
