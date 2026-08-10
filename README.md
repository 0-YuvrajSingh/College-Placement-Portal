# PlaceForge

## Overview

PlaceForge is a production-oriented MERN-based college placement management portal designed for students, recruiters, and placement coordinators (admins). As a final-year B.Tech-level full-stack project, it centralizes students, recruiters, jobs, applications, resumes, eligibility, application status, administration, and auditability into a single, cohesive platform governed by strict Role-Based Access Control (RBAC).

## Problem Statement

Campus recruitment often suffers from fragmented communication, relying on spreadsheets, WhatsApp, and emails for coordination. This leads to inconsistent application tracking, difficulty maintaining student and recruiter records, lack of centralized eligibility checking, and limited visibility into application status for all parties involved.

## Solution

PlaceForge implements a centralized architecture that enforces structured workflows:
`Student → Jobs / Eligibility → Applications → Recruiter → Application Status → Admin Oversight`

Role-specific workflows and object-level ownership checks ensure that sensitive data is only accessible to authorized users.

## Key Features

### Authentication
- Registration and Login
- JWT authentication and bcrypt password hashing
- Role-based access control (RBAC)

### Students
- Profile management (academic information, skills)
- Resume upload and replacement
- Job search and eligibility filtering
- Applications and application tracking
- Application withdrawal

### Recruiters
- Company profile management
- Recruiter approval workflow
- Job creation, editing, and status management
- Applicant listing and filtering
- Application status updates and recruiter remarks
- Secure resume access

### Admin
- Platform dashboard
- Student and recruiter management
- Recruiter approval and revocation
- Job management and status overrides
- Application visibility
- Audit logs

### Platform
- Pagination, search, and filtering
- Centralized validation and error handling
- Rate limiting and health endpoint
- Swagger/OpenAPI documentation
- Automated backend testing

## User Roles

| Capability | Student | Pending Recruiter | Approved Recruiter | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Manage own profile | ✓ | ✓ | ✓ | ✓ |
| Browse jobs | ✓ | — | — | ✓ |
| Apply to jobs | ✓ | — | — | — |
| Create jobs | — | ✗ | ✓ | — |
| Manage own jobs | — | ✗ | ✓ | — |
| Review applicants | — | ✗ | ✓ | — |
| Update application status | — | ✗ | ✓ | — |
| Manage students | — | — | — | ✓ |
| Manage recruiters | — | — | — | ✓ |
| Approve recruiters | — | — | — | ✓ |
| Manage jobs | — | — | — | ✓ |
| View audit logs | — | ✗ | ✗ | ✓ |

## Core Workflows

### Student Recruitment Workflow
Register → Login → Complete Profile → Upload Resume → Browse Jobs → Check Eligibility → Apply → Track Application → Withdraw (if permitted)

### Recruiter Workflow
Register → Pending Approval → Admin Approval → Company Profile → Create Job → Review Applicants → Update Application Status

### Admin Workflow
Login → Dashboard → Manage Students → Manage Recruiters → Approve/Revoke Recruiters → Manage Jobs → Review Applications → Override Job Status → Review Audit Logs

## Eligibility Engine

Job eligibility dynamically depends on implemented criteria such as CGPA, department, graduation year, and required skills. 
Eligibility is enforced consistently between both the job listing/filtering views and the core application validation logic. 

> **Important**: If a job imposes a requirement and the student lacks the required information on their profile, the student is treated as ineligible for that specific requirement.

## Application Lifecycle

PlaceForge applications strictly follow these allowed state transitions:

```text
APPLIED
   ↓
SHORTLISTED
   ↓
SELECTED
```
```text
APPLIED
   ↓
REJECTED
```
```text
APPLIED
   ↓
WITHDRAWN
```

## Resume Management & Security

- **Supported Formats**: `.pdf`, `.doc`, `.docx`
- **Validation**: Strict file size restrictions, MIME validation, and magic-byte/signature validation to prevent executable spoofing.
- **Security**: Server-generated filenames, authenticated downloads, and authorization checks.
- **Immutability**: When a student applies, the submitted resume is snapshotted. Later resume replacements on their profile do not alter the historical snapshot attached to the application.

## Recruiter Approval Workflow

```text
Recruiter registration
        ↓
Pending approval
        ↓
Admin approval
        ↓
Recruitment operations enabled
```
Pending recruiters can access permitted profile functionality but cannot perform protected recruitment mutations (e.g., creating jobs or updating application statuses) until explicitly approved by an Admin.

## Audit Logging

The platform tracks critical administrator actions, logging the admin ID, the action, the target entity, and the specific change payload. Implemented audit events include:
- Student activation/deactivation
- Recruiter approval/revocation
- Job status overrides

## Security

The application implements layered authentication, authorization, validation, file-access controls, and object-level ownership checks. Key protections include:
- JWT authentication & bcrypt hashing
- Recruiter approval enforcement & IDOR protection
- Request validation & MongoDB uniqueness constraints (preventing application race conditions)
- Secure resume access (preventing path traversal and static exposure)
- Helmet, CORS, and Rate Limiting
- Centralized error handling (no stack traces exposed in production)

## Architecture

### Backend
`Routes → Middleware → Controllers → Services → Models → MongoDB`

- **Routes**: Endpoint definitions and middleware composition.
- **Controllers**: HTTP request/response handling.
- **Services**: Business logic and workflows.
- **Models**: MongoDB/Mongoose persistence.
- **Middleware**: Authentication, authorization, validation, rate limiting, and error handling.

### Frontend
`React → React Router → Pages/Components → API Layer → Axios → Express API`

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19 + TypeScript 5.7 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router 7 |
| HTTP | Axios |
| Backend | Node.js + Express 4.21 |
| Database | MongoDB |
| ODM | Mongoose 8.9 |
| Authentication | JWT |
| Password hashing | bcrypt |
| File uploads | Multer |
| Validation | express-validator |
| Security | Helmet, CORS, rate limiting |
| API documentation | Swagger/OpenAPI |
| Testing | Jest + Supertest |
| Linting | oxlint |
| Formatting | oxfmt *(Gotcha: Currently corrupts some inline TS types, avoid running `npm run format`)* |

## Project Structure

```text
PlaceForge/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── docs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   └── index.html
│
└── AGENTS.md
```

## API Overview

**Route Prefixes:**
- `/api/auth`
- `/api/students`
- `/api/recruiter`
- `/api/jobs`
- `/api/student/applications`
- `/api/admin`
- `/api/stats`
- `/api/docs`

**Response Envelope:**
Success:
```json
{
  "success": true,
  "data": {}
}
```
Error:
```json
{
  "success": false,
  "message": "...",
  "code": "..."
}
```

## Database Design

- **User**: Base collection
- **Student**: Tied to `User`. Has `Applications`.
- **Recruiter**: Tied to `User`. Has `Jobs`.
- **Job**: Created by `Recruiter`. Contains requirements. Has `Applications`.
- **Application**: Compound unique index on `(student, job)`.
- **AuditLog**: Generated by Admin mutations.

## Authentication & Authorization

Authorization uses a layered approach:
`JWT → protect middleware → requireRole() → resource ownership / recruiter approval`
Role authorization alone is not the only control; object ownership is explicitly checked at the service/controller level.

## Validation & Error Handling

- Uses `express-validator` for input sanitization.
- Wraps async controllers in `asyncHandler`.
- Throws normalized `ApiError` instances.
- A centralized error middleware formats HTTP status codes into a consistent envelope and suppresses stack traces in production.

## Pagination, Search & Filtering

List endpoints are paginated and standardized.
- Implements a hard upper bound: `MAX_LIMIT = 50`.
- Includes metadata in the response: `{ page, limit, total, totalPages }`.
- Supports targeted search and filtering (e.g., job criteria, applicant statuses).

## Testing

**Backend automated tests**: 93/93 PASS (7 suites)
**Frontend Build**: TypeScript build PASS, Vite build PASS
**Frontend Lint**: oxlint PASS (0 warnings, 0 errors)

> Manual browser, responsive/mobile, and non-test-mode rate-limit verification remain final operational checks.

## Environment Setup

**Prerequisites:** Node.js (18+), MongoDB (v7+), npm.

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

| Variable | Required | Purpose |
| :--- | :---: | :--- |
| `NODE_ENV` | ✓ | Environment context (development/production) |
| `PORT` | ✓ | Express server port |
| `MONGO_URI` | ✓ | MongoDB connection string |
| `JWT_SECRET` | ✓ | JWT signing secret |
| `JWT_EXPIRES_IN` | ✓ | Token lifetime |
| `CLIENT_URL` | ✓ | CORS origin boundary |
| `UPLOAD_DIR` | ✓ | Target directory for resumes |
| `MAX_FILE_SIZE` | ✓ | Maximum bytes for file uploads |

## Running the Project

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend dev server proxies `/api` requests to Express.*

## API Documentation
Interactive Swagger documentation is available at `http://localhost:5000/api/docs`.

## Demo Accounts
*(Development/demo accounts only — after running `npm run seed`)*

| Role | Email | Password |
| :--- | :--- | :--- |
| Admin | `admin@placeforge.edu` | `Admin@1234` |
| Recruiter | `priya@acme.com` | `Recruiter@123` |
| Student | `aarav@college.edu` | `Student@123` |

## Production / Deployment Notes
- Use a strong unique `JWT_SECRET`.
- Configure production MongoDB and CORS origins.
- Do not commit `.env`.
- Do not expose `server/uploads/` statically.
- Use HTTPS and review rate limits.
- Monitor application errors and back up MongoDB.

## Known Limitations
- No automated browser/E2E suite (Playwright configured but tests unwritten).
- Responsive behavior requires manual QA.
- Development uses the local filesystem for resumes.
- Password reset and email notification workflows do not currently exist.

## Verification Status
- **Backend automated tests**: 93/93 PASS
- **Frontend build/lint**: PASS
- **Static security audit**: PASS
- **Dynamic backend verification**: PASS
- **Browser/mobile verification**: final manual check
- **Rate-limit runtime verification**: final operational check

## Future Improvements
- Automated Playwright E2E testing
- Production object storage for resumes (S3/GCS)
- Password reset/email notification workflow
- Stronger malware file scanning

## Learning Outcomes
This project demonstrates final-year B.Tech learning competencies in: MERN architecture, REST API design, MongoDB schema design, JWT authentication, RBAC, object-level authorization, state machines, file handling/security, validation, automated testing, concurrency handling, and auditability.

## Project Scope
This project intentionally focuses on campus recruitment management. Advanced systems such as AI recruitment, payment processing, real-time chat, and complex external integrations are outside the current scope.

## License
MIT License
