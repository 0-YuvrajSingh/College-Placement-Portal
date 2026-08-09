const swaggerUi = require("swagger-ui-express")

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "PlaceForge — Campus Recruitment Platform API",
    version: "1.0.0",
    description:
      "REST API for the PlaceForge campus placement portal. Connects students, recruiters, and placement coordinators through role-based job posting, eligibility checking, and application tracking. Authentication is JWT-based; all endpoints except registration/login/health require a Bearer token.",
    contact: { name: "PlaceForge" },
  },
  servers: [{ url: "/", description: "Local development server" }],
  tags: [
    { name: "Auth", description: "Registration, login, logout, current user" },
    { name: "Students", description: "Student profile and resume management" },
    {
      name: "Recruiters",
      description: "Company profile, job management, applicant management",
    },
    { name: "Jobs", description: "Job discovery and applications" },
    { name: "Applications", description: "Student application tracking" },
    { name: "Admin", description: "Placement coordinator administration" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Application deadline has passed" },
          code: {
            type: "string",
            example: "APPLICATION_DEADLINE_PASSED",
          },
          details: {
            type: "array",
            items: { type: "object" },
            description: "Validation field errors, when applicable",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              token: { type: "string", description: "JWT access token" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                  role: {
                    type: "string",
                    enum: ["student", "recruiter", "admin"],
                  },
                  isActive: { type: "boolean" },
                },
              },
            },
          },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Aarav Mehta" },
          email: { type: "string", example: "aarav@college.edu" },
          password: { type: "string", format: "password", example: "secret123" },
          role: {
            type: "string",
            enum: ["student", "recruiter"],
            description: "Defaults to student",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "aarav@college.edu" },
          password: { type: "string", format: "password" },
        },
      },
      StudentProfile: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          department: { type: "string" },
          rollNumber: { type: "string" },
          registrationNumber: { type: "string" },
          college: { type: "string" },
          course: { type: "string" },
          year: { type: "number" },
          semester: { type: "number" },
          cgpa: { type: "number" },
          graduationYear: { type: "number" },
          hasActiveBacklogs: { type: "boolean" },
          skills: { type: "array", items: { type: "string" } },
          education: { type: "array", items: { type: "object" } },
          profileCompleted: { type: "boolean" },
          isPlaced: { type: "boolean" },
          resume: {
            type: "object",
            nullable: true,
            properties: {
              filename: { type: "string" },
              originalname: { type: "string" },
              path: { type: "string" },
              mimetype: { type: "string" },
              size: { type: "number" },
              uploadedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
      Job: {
        type: "object",
        properties: {
          _id: { type: "string" },
          recruiter: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          companyName: { type: "string" },
          location: { type: "string" },
          employmentType: {
            type: "string",
            enum: ["Full-time", "Part-time", "Internship"],
          },
          workMode: { type: "string", enum: ["On-site", "Remote", "Hybrid"] },
          salary: {
            type: "object",
            nullable: true,
            properties: {
              min: { type: "number" },
              max: { type: "number" },
              currency: { type: "string" },
            },
          },
          skills: { type: "array", items: { type: "string" } },
          eligibility: {
            type: "object",
            properties: {
              minimumCgpa: { type: "number" },
              eligibleDepartments: { type: "array", items: { type: "string" } },
              eligibleGraduationYears: { type: "array", items: { type: "number" } },
              requiredSkills: { type: "array", items: { type: "string" } },
              backlogAllowed: { type: "boolean" },
            },
          },
          applicationDeadline: { type: "string", format: "date-time" },
          status: {
            type: "string",
            enum: ["DRAFT", "OPEN", "CLOSED", "EXPIRED"],
          },
        },
      },
      Application: {
        type: "object",
        properties: {
          _id: { type: "string" },
          student: { type: "string" },
          job: { type: "string" },
          recruiter: { type: "string" },
          resumeSnapshot: {
            type: "object",
            nullable: true,
            properties: {
              originalName: { type: "string" },
              storedName: { type: "string" },
              mimeType: { type: "string" },
              size: { type: "number" },
            },
          },
          status: {
            type: "string",
            enum: ["APPLIED", "SHORTLISTED", "REJECTED", "SELECTED", "WITHDRAWN"],
          },
          appliedAt: { type: "string", format: "date-time" },
          withdrawnAt: { type: "string", format: "date-time", nullable: true },
          remarks: { type: "string" },
          statusHistory: {
            type: "array",
            items: {
              type: "object",
              properties: {
                status: { type: "string" },
                changedBy: { type: "string" },
                changedAt: { type: "string", format: "date-time" },
                remarks: { type: "string" },
              },
            },
          },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "number", example: 1 },
          limit: { type: "number", example: 10 },
          total: { type: "number", example: 42 },
          totalPages: { type: "number", example: 5 },
        },
      },
      DashboardStats: {
        type: "object",
        properties: {
          totalStudents: { type: "number" },
          activeStudents: { type: "number" },
          totalRecruiters: { type: "number" },
          activeRecruiters: { type: "number" },
          totalJobs: { type: "number" },
          openJobs: { type: "number" },
          totalApplications: { type: "number" },
          shortlistedApplications: { type: "number" },
          selectedApplications: { type: "number" },
          placedStudents: { type: "number" },
        },
      },
      PlatformStats: {
        type: "object",
        description: "Public platform statistics",
        properties: {
          totalStudents: { type: "number" },
          activeStudents: { type: "number" },
          totalRecruiters: { type: "number" },
          activeRecruiters: { type: "number" },
          totalJobs: { type: "number" },
          openJobs: { type: "number" },
          totalApplications: { type: "number" },
          shortlistedApplications: { type: "number" },
          selectedApplications: { type: "number" },
          placedStudents: { type: "number" },
          placementRate: { type: "number" },
          highestPackage: { type: "number", nullable: true },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Auth"],
        summary: "Health check",
        responses: { "200": { description: "Server is running" } },
      },
    },
    "/api/stats": {
      get: {
        tags: ["Public"],
        summary: "Public platform statistics (landing page)",
        responses: {
          "200": {
            description: "Aggregate platform statistics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PlatformStats" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a student or recruiter",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } },
          },
        },
        responses: {
          "201": { description: "Registered. Returns token and user" },
          "409": { description: "Email already exists" },
          "422": { description: "Validation failed" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } },
          },
        },
        responses: {
          "200": { description: "Successful login" },
          "401": { description: "Invalid credentials" },
          "403": { description: "Account deactivated" },
          "429": { description: "Too many attempts" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout (stateless — client discards the token)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Logged out" } },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user and role profile",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "User + profile" } },
      },
    },

    "/api/students/me/profile": {
      get: {
        tags: ["Students"],
        summary: "View own student profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Student profile" },
          "404": { description: "Profile not created yet" },
        },
      },
      post: {
        tags: ["Students"],
        summary: "Create own student profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StudentProfile" },
            },
          },
        },
        responses: {
          "201": { description: "Profile created" },
          "409": { description: "Profile already exists" },
          "422": { description: "Validation failed" },
        },
      },
      put: {
        tags: ["Students"],
        summary: "Update own student profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StudentProfile" },
            },
          },
        },
        responses: {
          "200": { description: "Profile updated" },
          "404": { description: "Profile not created yet" },
        },
      },
    },
    "/api/students/me/resume": {
      get: {
        tags: ["Students"],
        summary: "Download own resume (PDF/DOC/DOCX)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Resume file" },
          "404": { description: "No resume uploaded" },
        },
      },
      post: {
        tags: ["Students"],
        summary: "Upload resume (multipart field `resume`, max 5MB)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  resume: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Resume metadata saved" },
          "400": { description: "Invalid file type/size" },
        },
      },
      delete: {
        tags: ["Students"],
        summary: "Delete own resume",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Resume deleted" } },
      },
    },

    "/api/recruiter/profile": {
      get: {
        tags: ["Recruiters"],
        summary: "View own company profile",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Company profile" } },
      },
      put: {
        tags: ["Recruiters"],
        summary: "Create or update company profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  companyName: { type: "string" },
                  companyDescription: { type: "string" },
                  website: { type: "string" },
                  industry: { type: "string" },
                  location: { type: "string" },
                  contactPerson: { type: "string" },
                  contactPhone: { type: "string" },
                  companySize: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Profile upserted" } },
      },
    },
    "/api/recruiter/jobs": {
      post: {
        tags: ["Recruiters"],
        summary: "Create a job",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Job" } },
          },
        },
        responses: {
          "201": { description: "Job created" },
          "400": { description: "Invalid deadline" },
          "422": { description: "Validation failed" },
        },
      },
      get: {
        tags: ["Recruiters"],
        summary: "List own jobs",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["DRAFT", "OPEN", "CLOSED", "EXPIRED"] },
          },
        ],
        responses: { "200": { description: "Jobs + pagination" } },
      },
    },
    "/api/recruiter/jobs/{id}": {
      get: {
        tags: ["Recruiters"],
        summary: "Get own job",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Job" } },
      },
      put: {
        tags: ["Recruiters"],
        summary: "Update own job",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Job" } },
          },
        },
        responses: { "200": { description: "Job updated" } },
      },
      delete: {
        tags: ["Recruiters"],
        summary: "Delete own job (blocked if it has applications)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Job deleted" },
          "400": { description: "Job has applications" },
        },
      },
    },
    "/api/recruiter/jobs/{id}/status": {
      patch: {
        tags: ["Recruiters"],
        summary: "Change job status (DRAFT→OPEN→CLOSED)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["DRAFT", "OPEN", "CLOSED"],
                  },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Status changed" } },
      },
    },
    "/api/recruiter/jobs/{jobId}/applications": {
      get: {
        tags: ["Recruiters"],
        summary: "List applicants for own job",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "jobId", in: "path", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["APPLIED", "SHORTLISTED", "REJECTED", "SELECTED", "WITHDRAWN"],
            },
          },
        ],
        responses: { "200": { description: "Applications + pagination" } },
      },
    },
    "/api/recruiter/applications": {
      get: {
        tags: ["Recruiters"],
        summary: "List applicants across all own job postings",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["APPLIED", "SHORTLISTED", "REJECTED", "SELECTED", "WITHDRAWN"],
            },
          },
          { name: "jobId", in: "query", schema: { type: "string" } },
          {
            name: "search",
            in: "query",
            schema: { type: "string", description: "Student name/email or job title" },
          },
        ],
        responses: { "200": { description: "Applications + student profiles + pagination" } },
      },
    },
    "/api/recruiter/stats": {
      get: {
        tags: ["Recruiters"],
        summary: "Recruiter dashboard statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description:
              "totalJobs, activeJobs, closingSoon, totalApplicants, applied, shortlisted, rejected, selected, withdrawn",
          },
        },
      },
    },
    "/api/recruiter/applications/{id}": {
      get: {
        tags: ["Recruiters"],
        summary: "Get application detail (own job)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Application + student profile" } },
      },
    },
    "/api/recruiter/applications/{id}/status": {
      patch: {
        tags: ["Recruiters"],
        summary:
          "Update application status (APPLIED→SHORTLISTED→SELECTED/REJECTED)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["SHORTLISTED", "REJECTED", "SELECTED"],
                  },
                  remarks: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Status changed" },
          "400": { description: "Invalid transition" },
        },
      },
    },
    "/api/recruiter/applications/{id}/resume": {
      get: {
        tags: ["Recruiters"],
        summary: "Download applicant resume (own job)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Resume file" } },
      },
    },

    "/api/jobs": {
      get: {
        tags: ["Jobs"],
        summary:
          "Discover open jobs — pagination, search, branch/location/type/work-mode/CGPA filters, sorting, eligibility-aware listing",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "department", in: "query", schema: { type: "string" } },
          {
            name: "employmentType",
            in: "query",
            schema: { type: "string", enum: ["Full-time", "Part-time", "Internship"] },
          },
          {
            name: "workMode",
            in: "query",
            schema: { type: "string", enum: ["On-site", "Remote", "Hybrid"] },
          },
          { name: "minCgpa", in: "query", schema: { type: "number" } },
          { name: "eligible", in: "query", schema: { type: "string", enum: ["true"] } },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: ["createdAt", "applicationDeadline", "title", "salary"],
            },
          },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        ],
        responses: { "200": { description: "Jobs + pagination" } },
      },
    },
    "/api/jobs/{id}": {
      get: {
        tags: ["Jobs"],
        summary: "Get open job details (includes eligibility check for students)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Job + eligibility info" } },
      },
    },
    "/api/jobs/{jobId}/apply": {
      post: {
        tags: ["Jobs"],
        summary:
          "Apply to a job. Enforces active account, open job, deadline, eligibility, resume, and no duplicate application.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "jobId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "201": { description: "Application created" },
          "400": { description: "Not eligible / deadline passed / resume required" },
          "409": { description: "Already applied" },
        },
      },
    },

    "/api/student/applications": {
      get: {
        tags: ["Applications"],
        summary: "List own applications",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["APPLIED", "SHORTLISTED", "REJECTED", "SELECTED", "WITHDRAWN"],
            },
          },
        ],
        responses: { "200": { description: "Applications + pagination" } },
      },
    },
    "/api/student/applications/{id}": {
      get: {
        tags: ["Applications"],
        summary: "Get own application",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Application" } },
      },
    },
    "/api/student/applications/{id}/withdraw": {
      patch: {
        tags: ["Applications"],
        summary: "Withdraw own application (only from APPLIED state)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Application withdrawn" },
          "400": { description: "Cannot withdraw in current state" },
        },
      },
    },

    "/api/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Placement dashboard statistics",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Dashboard stats" } },
      },
    },
    "/api/admin/students": {
      get: {
        tags: ["Admin"],
        summary: "List students (search + active filter)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "isActive", in: "query", schema: { type: "string", enum: ["true", "false"] } },
        ],
        responses: { "200": { description: "Students + pagination" } },
      },
    },
    "/api/admin/students/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get student detail",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Student + profile" } },
      },
    },
    "/api/admin/students/{id}/status": {
      patch: {
        tags: ["Admin"],
        summary: "Activate/deactivate a student",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isActive"],
                properties: { isActive: { type: "boolean" } },
              },
            },
          },
        },
        responses: { "200": { description: "Status updated" } },
      },
    },
    "/api/admin/recruiters": {
      get: {
        tags: ["Admin"],
        summary: "List recruiters",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "isActive", in: "query", schema: { type: "string", enum: ["true", "false"] } },
        ],
        responses: { "200": { description: "Recruiters + pagination" } },
      },
    },
    "/api/admin/recruiters/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get recruiter detail",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Recruiter + profile" } },
      },
    },
    "/api/admin/recruiters/{id}/status": {
      patch: {
        tags: ["Admin"],
        summary: "Activate/deactivate a recruiter or approve the company",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  isActive: { type: "boolean" },
                  isApproved: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Status updated" } },
      },
    },
    "/api/admin/jobs": {
      get: {
        tags: ["Admin"],
        summary: "List all jobs",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "Jobs + pagination" } },
      },
    },
    "/api/admin/jobs/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get job detail",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Job" } },
      },
    },
    "/api/admin/jobs/{id}/status": {
      patch: {
        tags: ["Admin"],
        summary: "Change job status",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["DRAFT", "OPEN", "CLOSED", "EXPIRED"],
                  },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Status updated" } },
      },
    },
    "/api/admin/applications": {
      get: {
        tags: ["Admin"],
        summary: "List all applications",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "jobId", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "Applications + pagination" } },
      },
    },
    "/api/admin/applications/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get application detail",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Application" } },
      },
    },
    "/api/admin/applications/{id}/resume": {
      get: {
        tags: ["Admin"],
        summary: "Download applicant resume",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Resume file" } },
      },
    },
  },
}

module.exports = { swaggerSpec, swaggerUi }
