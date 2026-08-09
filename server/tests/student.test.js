const request = require("supertest")
const app = require("../app")
const { createUser, createStudent, login, authHeader } = require("./helpers")

describe("Student profile", () => {
  it("returns 404 before the profile is created, then creates it", async () => {
    await createUser({ name: "No Profile", email: "np@test.edu", role: "student" })
    const res = await login("np@test.edu")
    const headers = authHeader(res.body.data.token)

    const before = await request(app)
      .get("/api/students/me/profile")
      .set(headers)
    expect(before.status).toBe(404)

    const created = await request(app).post("/api/students/me/profile").set(headers).send({
      name: "No Profile",
      email: "np@test.edu",
      phone: "9876543210",
      department: "Computer Science",
      year: 4,
      semester: 8,
      cgpa: 8.5,
      graduationYear: 2026,
      skills: ["JavaScript"],
    })
    expect(created.status).toBe(201)
    expect(created.body.data.profile.profileCompleted).toBe(true)
  })

  it("returns 409 when a profile already exists", async () => {
    await createStudent({ email: "dup@test.edu" })
    const res = await login("dup@test.edu")
    const created = await request(app)
      .post("/api/students/me/profile")
      .set(authHeader(res.body.data.token))
      .send({
        name: "X",
        email: "x@test.edu",
        phone: "9876543210",
        department: "Computer Science",
        year: 4,
        semester: 8,
        cgpa: 8,
        graduationYear: 2026,
      })
    expect(created.status).toBe(409)
  })

  it("updates the profile", async () => {
    await createStudent({ email: "up@test.edu", cgpa: 8.0 })
    const res = await login("up@test.edu")
    const updated = await request(app)
      .put("/api/students/me/profile")
      .set(authHeader(res.body.data.token))
      .send({ cgpa: 9.0, skills: ["React"] })
    expect(updated.status).toBe(200)
    expect(updated.body.data.profile.cgpa).toBe(9)
  })

  it("rejects invalid profile data with 422", async () => {
    await createStudent({ email: "v@test.edu" })
    const res = await login("v@test.edu")
    const bad = await request(app)
      .put("/api/students/me/profile")
      .set(authHeader(res.body.data.token))
      .send({ cgpa: 15 })
    expect(bad.status).toBe(422)
    expect(bad.body.code).toBe("VALIDATION_ERROR")
  })
})

describe("Student resume", () => {
  it("uploads, downloads and deletes a resume", async () => {
    await createStudent({ email: "rv@test.edu" })
    const res = await login("rv@test.edu")
    const headers = authHeader(res.body.data.token)

    const upload = await request(app)
      .post("/api/students/me/resume")
      .set(headers)
      .attach("resume", Buffer.from("%PDF-1.4 mock resume"), "resume.pdf")
    expect(upload.status).toBe(200)
    expect(upload.body.data.resume.mimetype).toBe("application/pdf")
    expect(upload.body.data.resume.originalname).toBe("resume.pdf")

    const download = await request(app).get("/api/students/me/resume").set(headers)
    expect(download.status).toBe(200)

    const del = await request(app).delete("/api/students/me/resume").set(headers)
    expect(del.status).toBe(200)

    const gone = await request(app).get("/api/students/me/resume").set(headers)
    expect(gone.status).toBe(404)
  })

  it("rejects non-PDF file types", async () => {
    await createStudent({ email: "exe@test.edu" })
    const res = await login("exe@test.edu")
    const upload = await request(app)
      .post("/api/students/me/resume")
      .set(authHeader(res.body.data.token))
      .attach("resume", Buffer.from("MZ definitely not a pdf"), "evil.exe")
    expect(upload.status).toBe(400)
  })

  it("rejects oversized uploads", async () => {
    await createStudent({ email: "big@test.edu" })
    const res = await login("big@test.edu")
    const big = Buffer.alloc(6 * 1024 * 1024, "x")
    const upload = await request(app)
      .post("/api/students/me/resume")
      .set(authHeader(res.body.data.token))
      .attach("resume", big, "huge.pdf")
    expect(upload.status).toBe(400)
    expect(upload.body.code).toBe("FILE_UPLOAD_ERROR")
  })

  it("requires an existing profile before uploading", async () => {
    await createUser({ name: "No Prof", email: "noprofile@test.edu", role: "student" })
    const res = await login("noprofile@test.edu")
    const upload = await request(app)
      .post("/api/students/me/resume")
      .set(authHeader(res.body.data.token))
      .attach("resume", Buffer.from("%PDF-1.4 x"), "resume.pdf")
    expect(upload.status).toBe(404)
  })
})
