# PlaceForge — Campus Recruitment Management Platform

A full-stack campus placement portal for **students**, **recruiters**, and the **placement office (admin)**, built with the MERN stack.

Students browse and apply to job openings (with eligibility checks), track application statuses, and manage their profile and resume. Recruiters post and manage jobs, review applicants, and shortlist/select/reject in one place. Admins oversee the entire platform — students, recruiters, jobs, applications, and placement analytics.

**Stack:** MongoDB · Express.js · React (Vite + TypeScript + Tailwind CSS) · Node.js · JWT · Multer · express-validator · Jest + Supertest

---

## 1. Features

### Students
- Register / login, dashboard with placement overview
- Browse open jobs with search, filters (location, employment type, work mode, department, salary), and an **"only eligible"** toggle backed by a real eligibility engine (CGPA, department, graduation year, backlogs, required skills)
- Job detail view with eligibility breakdown and application deadlines
- Apply to jobs (requires a complete profile + resume), withdraw applications, track status timeline
- Career profile management (academics, skills, education) with resume upload/download/delete

### Recruiters
- Company profile management
- Post, edit, open/close, and delete job postings
- View applications per job with filtering; drill into an applicant's profile and resume
- Move applications through the pipeline: Applied → Shortlisted → Selected / Rejected (with optional remarks)

### Admin (Placement Office)
- Platform dashboard with placement analytics
- Manage students (activate/deactivate, mark placed) and recruiters (activate, approve)
- Oversee all jobs and applications; download any applicant's resume

### General
- JWT auth with role-based route protection and session restore
- Input validation on every write endpoint, centralized error handling, rate limiting on auth routes, Helmet security headers
- OpenAPI (Swagger) docs at `GET /api/docs`
- Paginated list endpoints everywhere; application status history recorded

---

## 2. Folder Structure

```
PlaceForge/
├── server/                    # Express + MongoDB API (CommonJS)
│   ├── server.js              # entry: connect DB + listen
│   ├── app.js                 # middleware, route mounts, error handlers
│   ├── .env.example           # environment template (copy to .env)
│   ├── config/                # db connection, constants (roles/statuses)
│   ├── controllers/           # auth, student, recruiter, job, application, admin, stats
│   ├── services/              # job listing, eligibility engine, pagination
│   ├── models/                # User, Student, Recruiter, Job, Application
│   ├── routes/                # /api/auth, /api/students, /api/recruiter, /api/jobs, ...
│   ├── middleware/            # auth (JWT + roles), validation, upload (multer), errors
│   ├── validators/            # express-validator rules per resource
│   ├── docs/                  # Swagger spec
│   ├── seeds/seed.js          # demo data
│   ├── tests/                 # Jest + Supertest suites
│   └── uploads/               # uploaded resumes (gitignored)
├── frontend/                  # React (Vite) + TypeScript + Tailwind CSS
│   └── src/
│       ├── main.tsx           # entry
│       ├── App.tsx            # router + role-protected layouts
│       ├── api/               # typed API clients (auth, jobs, student, recruiter, admin)
│       ├── components/        # Layout, Protected, UI kit, StatusActions
│       ├── context/           # AuthContext, ToastContext
│       ├── lib/               # axios wrapper, constants, formatters
│       ├── hooks/
│       └── pages/             # Landing, auth + per-role pages
└── UI Design/                 # approved Figma design reference (mock app + plans)
```

---

## 3. Prerequisites

- **Node.js 18+** (tested on Node 22)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` (or a remote URI)

---

## 4. Setup

### 4.1 Backend

```bash
cd server
cp .env.example .env      # then edit .env (Mongo URI, JWT secret)
npm install
npm run seed              # optional: load demo data
npm run dev               # nodemon on http://localhost:5000
```

Key `.env` variables:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | API port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/placement_portal` | Database connection |
| `JWT_SECRET` | — | **Change this** to a long random string |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |
| `UPLOAD_DIR` | `uploads` | Resume storage folder |
| `MAX_FILE_SIZE` | `5242880` | Max resume size (bytes) |

### 4.2 Frontend

```bash
cd frontend
npm install
npm run dev              # Vite on http://localhost:5173 (proxies /api -> :5000)
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` to the backend, so no CORS setup is needed in development.

### 4.3 Production build

```bash
cd frontend
npm run build            # outputs to frontend/dist (tsc type-check + vite build)
```

---

## 5. Demo Accounts (after `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@placeforge.edu` | `Admin@1234` |
| Recruiter | `priya@acme.com` | `Recruiter@123` |
| Recruiter | `rajesh@infotech.com` | `Recruiter@123` |
| Recruiter | `neha@novabank.com` | `Recruiter@123` |
| Student | `aarav@college.edu` | `Student@123` |
| Student | `sanya@college.edu` | `Student@123` |
| Student | `rohan@college.edu` | `Student@123` |
| Student | `ishita@college.edu` | `Student@123` |
| Student | `kabir@college.edu` | `Student@123` |

Seeding clears and recreates users, students, recruiters, jobs, and applications.

---

## 6. API Overview

All endpoints are under `/api` and respond with `{ success: true, data }` (or `{ success: false, message, code }` on errors). Paginated list endpoints include `pagination: { page, limit, total, totalPages }`.

| Area | Route prefix | Notes |
|---|---|---|
| Auth | `/api/auth` | `register`, `login`, `logout`, `me` |
| Public stats | `/api/stats` | Landing page numbers |
| Jobs | `/api/jobs` | List (search/filter/sort/eligible), detail, apply |
| Student | `/api/students` | Own profile CRUD + resume upload/download/delete |
| Student applications | `/api/student/applications` | Own applications + withdraw |
| Recruiter | `/api/recruiter` | Profile, jobs CRUD, applications + status, stats |
| Admin | `/api/admin` | Dashboard, students/recruiters/jobs/applications management |

Full interactive documentation: **http://localhost:5000/api/docs** (Swagger UI).

---

## 7. Tests

The backend ships Jest + Supertest suites covering auth, security, students, recruiters, jobs, applications, and admin.

```bash
cd server
npm test                 # requires MongoDB running (uses placement_portal_test DB)
```

---

## 8. Security Notes

- Passwords are hashed with bcrypt; sessions use signed JWTs stored in localStorage.
- Resume uploads are restricted by MIME type and size, and resume downloads require an authenticated request (the frontend downloads them via the JWT-authenticated API, not public file URLs).
- **Rotate the default `JWT_SECRET`** in `server/.env` before any real deployment.

---

## 9. Notes

- `UI Design/` contains the approved Figma design reference (a self-contained mock app) and the original implementation plan. It is not part of the running application.
- Uploaded resume files live in `server/uploads/` (gitignored).
