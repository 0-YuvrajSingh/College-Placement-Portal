const request = require("supertest")
const app = require("../app")
const { createUser, login } = require("./helpers")

describe("Authentication", () => {
  describe("POST /api/auth/register", () => {
    it("registers a student and returns a token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "New Student", email: "new@test.edu", password: "secret123" })
      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.token).toBeDefined()
      expect(res.body.data.user.role).toBe("student")
    })

    it("registers a recruiter when role is recruiter", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "HR Person", email: "hr@test.com", password: "secret123", role: "recruiter" })
      expect(res.status).toBe(201)
      expect(res.body.data.user.role).toBe("recruiter")
    })

    it("rejects duplicate email with 409", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ name: "A", email: "dup@test.edu", password: "secret123" })
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "B", email: "dup@test.edu", password: "secret123" })
      expect(res.status).toBe(409)
      expect(res.body.code).toBe("EMAIL_EXISTS")
    })

    it("rejects invalid payloads with 422", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "", email: "not-an-email", password: "123" })
      expect(res.status).toBe(422)
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })

    it("does not allow public registration as admin", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Hacker", email: "hack@test.edu", password: "secret123", role: "admin" })
      expect(res.status).toBe(422)
    })
  })

  describe("POST /api/auth/login", () => {
    it("logs in with valid credentials", async () => {
      const user = await createUser({ name: "T", email: "t@test.edu", role: "student" })
      const res = await login("t@test.edu")
      expect(res.status).toBe(200)
      expect(res.body.data.user.id).toBe(String(user._id))
      expect(res.body.data.token).toBeDefined()
    })

    it("rejects an invalid password", async () => {
      await createUser({ name: "T", email: "t2@test.edu", role: "student" })
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "t2@test.edu", password: "wrong-password" })
      expect(res.status).toBe(401)
      expect(res.body.code).toBe("INVALID_CREDENTIALS")
    })

    it("blocks deactivated accounts", async () => {
      await createUser({ name: "T", email: "t3@test.edu", role: "student", isActive: false })
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "t3@test.edu", password: "secret123" })
      expect(res.status).toBe(403)
      expect(res.body.code).toBe("ACCOUNT_DEACTIVATED")
    })

    it("rejects an unknown email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@test.edu", password: "secret123" })
      expect(res.status).toBe(401)
    })
  })

  describe("Protected routes", () => {
    it("GET /api/auth/me without token returns 401", async () => {
      const res = await request(app).get("/api/auth/me")
      expect(res.status).toBe(401)
    })

    it("GET /api/auth/me with an invalid token returns 401", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.token.here")
      expect(res.status).toBe(401)
    })

    it("GET /api/auth/me with a valid token returns the user", async () => {
      await createUser({ name: "T", email: "me@test.edu", role: "student" })
      const res = await login("me@test.edu")
      const me = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${res.body.data.token}`)
      expect(me.status).toBe(200)
      expect(me.body.data.user.email).toBe("me@test.edu")
    })

    it("never returns the password hash", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "P", email: "p@test.edu", password: "secret123" })
      expect(JSON.stringify(res.body)).not.toContain("secret123")
      expect(JSON.stringify(res.body)).not.toContain("$2a$")
      expect(JSON.stringify(res.body)).not.toContain("$2b$")
    })
  })

  describe("POST /api/auth/logout", () => {
    it("returns success for an authenticated user", async () => {
      await createUser({ name: "T", email: "lo@test.edu", role: "student" })
      const res = await login("lo@test.edu")
      const out = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${res.body.data.token}`)
      expect(out.status).toBe(200)
    })
  })
})
