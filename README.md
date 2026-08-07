# College Placement Portal — Student Profile Management (MERN)

A MERN stack web app for a College Placement Portal, implementing **only the Student
Profile Management module**: student registration/login, profile create/update/view,
and resume upload/delete. Recruiter, admin, jobs, applications, search, dashboard and
analytics features are intentionally out of scope.

**Stack:** MongoDB · Express.js · React (Vite) · Node.js · Bootstrap 5 · React Router · Axios · JWT (localStorage) · Multer · bcrypt · express-validator

---

## 1. Folder Structure

```
college-placement-portal/
├── package.json                  # root scripts (run server + client together)
├── .gitignore
├── README.md
├── server/                       # Node.js + Express backend (CommonJS)
│   ├── package.json
│   ├── .env.example              # environment variables template
│   ├── .env                      # local env vars (not committed)
│   ├── server.js                 # app entry: middleware, routes, static uploads, errors
│   ├── config/
│   │   └── db.js                 # mongoose connection
│   ├── models/
│   │   ├── User.js               # auth record (email/password/role)
│   │   └── Student.js            # student profile + embedded resume metadata
│   ├── controllers/
│   │   ├── authController.js     # register, login, getMe
│   │   └── studentController.js  # profile CRUD + resume upload/delete
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   └── studentRoutes.js      # /api/students/*
│   ├── middleware/
│   │   ├── authMiddleware.js     # protect (JWT) + requireRole (role guard)
│   │   ├── errorMiddleware.js    # notFound + centralized error handler
│   │   └── uploadMiddleware.js   # Multer disk storage + file type/size rules
│   ├── utils/
│   │   └── generateToken.js      # JWT signing helper
│   └── uploads/                  # uploaded resume files (generated, gitignored)
└── client/                       # React + Vite frontend (ES Modules)
    ├── package.json
    ├── vite.config.js            # dev proxy for /api and /uploads
    ├── index.html
    └── src/
        ├── main.jsx              # entry: BrowserRouter + AuthProvider + Bootstrap CSS
        ├── App.jsx               # route definitions
        ├── index.css
        ├── api/
        │   └── axios.js          # axios instance + auth token interceptor
        ├── context/
        │   └── AuthContext.jsx   # user/token state, login/register/logout, session restore
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── Message.jsx       # reusable Bootstrap alert
        │   └── ProfileForm.jsx   # shared create/update form
        └── pages/
            ├── Home.jsx
            ├── Register.jsx
            ├── Login.jsx
            ├── CreateProfile.jsx
            ├── UpdateProfile.jsx
            └── ViewProfile.jsx
```

---

## 2. Backend API Design

All responses use a consistent envelope: `{ success: true, data: ... }` or `{ success: false, message: ... }`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Register a student. Body: `name, email, password` |
| POST | `/api/auth/login` | public | Login. Body: `email, password` |
| GET | `/api/auth/me` | student | Get current logged-in user |
| GET | `/api/students/me/profile` | student | View own profile (404 if not created) |
| POST | `/api/students/me/profile` | student | Create profile (409/400 if exists) |
| PUT | `/api/students/me/profile` | student | Update profile |
| POST | `/api/students/me/resume` | student | Upload resume (multipart field `resume`, PDF/DOC/DOCX ≤ 5MB) |
| DELETE | `/api/students/me/resume` | student | Delete resume + file |
| GET | `/api/health` | public | Server health check |
| GET | `/uploads/:filename` | public | Serve uploaded resume files |

**Validation (express-validator):** name required; email format; password ≥ 6 chars
(register); phone `^[0-9]{10,15}$`; department in whitelist; year 1–4; semester 1–8;
cgpa 0–10 float; skills must be an array.

**Role-based access:** `requireRole('student')` guards every `/api/students/*` route.
`protect` verifies the JWT and loads the user.

---

## 3. MongoDB Schemas

**User** (`users` collection)
- `name` String (required)
- `email` String (required, unique, lowercase)
- `password` String (required, min 6, hashed with bcrypt, `select: false`)
- `role` String, enum `['student']`, default `'student'` (ready for future roles)
- `timestamps`
- Pre-save hook hashes the password; `matchPassword(plain)` for login.

**Student** (`students` collection)
- `user` ObjectId → User (required, **unique** → one profile per user)
- `name`, `email` String
- `phone` String (pattern validated)
- `department` String (enum)
- `year` Number (1–4)
- `skills` **[String]** (array — never a string)
- `cgpa` Number (0–10)
- `semester` Number (1–8)
- `resume` embedded subdocument `{ filename, originalname, path, mimetype, size, uploadedAt }` (default null)
- `timestamps`

---

## 4. React Pages / Components

| File | Purpose |
|---|---|
| `Home.jsx` | Public landing page with links to register/login |
| `Register.jsx` | Registration form (name, email, password, confirm) |
| `Login.jsx` | Login form (email, password) |
| `CreateProfile.jsx` | Profile creation form |
| `UpdateProfile.jsx` | Pre-filled edit form + resume upload/delete section |
| `ViewProfile.jsx` | Read-only profile card, resume download/delete, edit link |
| `ProfileForm.jsx` | Shared form component used by create/update (skills entered comma-separated → stored as array) |
| `Navbar.jsx` | Bootstrap navbar with auth-aware links |
| `ProtectedRoute.jsx` | Redirects unauthenticated users to `/login` |
| `Message.jsx` | Reusable Bootstrap alert for success/error |

---

## 5. Authentication Flow

1. **Register / Login** → client posts to `/api/auth/register` or `/api/auth/login`.
2. Server hashes/compares password with **bcrypt**, signs a **JWT** `{ id, role }` (expiry from `JWT_EXPIRES_IN`, default 7d) and returns `{ token, user }`.
3. Client stores the token in **localStorage** via `AuthContext`.
4. `api/axios.js` request interceptor attaches `Authorization: Bearer <token>` to every request.
5. On refresh, `AuthContext` reads the stored token and calls `GET /api/auth/me` to restore the user session. On 401 the token is cleared.
6. `ProtectedRoute` blocks unauthenticated access to `/profile`, `/profile/create`, `/profile/update`.

---

## 6. Resume Upload Flow

1. Frontend picks a file, validates type (PDF/DOC/DOCX) and size (≤ 5MB), sends `FormData` to `POST /api/students/me/resume`.
2. **Multer** (disk storage) saves the file to `server/uploads/` with a unique filename and enforces file type + 5MB limit server-side.
3. The controller stores **metadata** (`filename, originalname, path, mimetype, size, uploadedAt`) in the student's `resume` field. Uploading again replaces the old file (previous file is deleted from disk).
4. Files are served publicly via `app.use('/uploads', express.static(...))` so the resume download link (`/uploads/<filename>`) works directly.
5. `DELETE /api/students/me/resume` removes the file from disk and clears the metadata.

---

## 7. Setup & Run

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or a MongoDB Atlas URI)

### Steps
```bash
# 1. Create env files (from the templates)
copy server/.env.example server/.env      # then edit values if needed

# 2. Install all dependencies (root, server, client)
npm run install-all

# 3. Start both server and client together (uses concurrently)
npm run dev
```

- Backend: http://localhost:5000  (health check: `GET /api/health`)
- Frontend: http://localhost:5173 (Vite proxies `/api` and `/uploads` to port 5000)

### Scripts
| Where | Command | Description |
|---|---|---|
| root | `npm run dev` | Run server + client together |
| root | `npm run server` / `npm run client` | Run one side |
| server | `npm run dev` | Backend with nodemon |
| client | `npm run dev` | Frontend dev server |
| client | `npm run build` | Production build |

---

## 8. Deliberately Out of Scope

Recruiter and admin modules, job posting/listing, applications, status tracking,
job search, dashboard, analytics, chat, payments, and other advanced features were
**not** implemented per the project requirements.
