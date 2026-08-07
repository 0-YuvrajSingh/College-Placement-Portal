You are an expert Senior Product Designer and UX Architect.

Create a complete low-to-mid fidelity Figma wireframe for **CollegeConnect**, focused only on the **Student Profile Management** module.

Design goals:
- Clean, modern, professional, student-friendly UI
- Bootstrap 5 layout patterns
- Desktop-first design at 1440px
- Mobile responsive design at 390px
- 12-column Bootstrap grid on desktop
- 8px spacing system
- Auto Layout for every component
- Reusable components and variants
- Low-to-mid fidelity only
- No high-fidelity branding, illustrations, or decorative visuals
- Focus on layout, hierarchy, spacing, and usability

Product scope:
- Student-only portal
- Exclude: recruiter tools, admin tools, placement officer views, job postings, job listings, job applications, search, dashboard analytics, chat, and payment screens
- Do not reference recruiters, placement officers, companies visited, or placement rates anywhere in the copy

-----------------------------------------
DESIGN SYSTEM
-----------------------------------------

Grid
- Desktop: 12 columns
- Margin: 80px
- Gutter: 24px
- Mobile: 4 columns

Spacing scale
- 8, 16, 24, 32, 48, 64

Typography (Bootstrap 5 type scale)
- H1: 48
- H2: 36
- H3: 28
- H4: 24
- Body: 16
- Small: 14
- Button label: 16, Medium weight

Radius
- Buttons: 10px
- Inputs: 10px
- Cards: 16px
- Modals: 12px

Component states
- Buttons: default, hover, disabled, loading
- Inputs: default, focus, error, success, disabled

Visual style
- Grayscale wireframe
- Blue accent placeholders
- Clear spacing and alignment
- Bootstrap-inspired form and card structure

Components
- Buttons (primary, secondary, danger)
- Inputs
- Select
- Textarea
- Badge
- Alert
- Modal
- Card
- Table
- Navbar
- Sidebar
- Avatar
- Progress Bar
- Breadcrumb
- Pagination
- Dropdown
- File Upload
- Toast
- Spinner

-----------------------------------------
SCREEN 1
HOME PAGE
-----------------------------------------

Navigation Bar
- Logo: CollegeConnect
- Links: Home, About, Login, Register

Hero Section
- Heading: CollegeConnect
- Subheading: Manage your student profile and resume in one simple, secure place.
- Buttons: Register, Login

Feature Cards (3)
- Student Profile
- Resume Upload
- Secure Authentication

Footer

-----------------------------------------
SCREEN 2
REGISTER
-----------------------------------------

Centered Card
- Title: Create Account
- Fields: Full Name, Email, Password, Confirm Password
- Checkbox: Accept Terms
- Primary Button: Register
- Bottom Link: Already have an account? Login
- Validation states: Success, Error
- Button states: Disabled, Loading

-----------------------------------------
SCREEN 3
LOGIN
-----------------------------------------

Centered Login Card
- Fields: Email, Password
- Remember Me
- Forgot Password link
- Primary Button: Login
- Secondary Link: Create Account

-----------------------------------------
SCREEN 4
STUDENT DASHBOARD
-----------------------------------------

Top Navbar
- Logo, Notifications, Profile Avatar, Logout

Left Sidebar
- Dashboard, My Profile, Update Profile, Resume, Settings

Main Content
- Welcome Card
- Profile Completion Progress
- Quick Stats Cards: Profile Created, Resume Uploaded, CGPA, Department
- Recent Activity Card
- Quick Action Buttons: Create Profile, Update Profile, Upload Resume

-----------------------------------------
SCREEN 5
CREATE PROFILE
-----------------------------------------

Large Bootstrap Card

Sections
- Personal Information
- Academic Information
- Skills
- Resume

Fields
- Name, Email, Phone
- Department, Year, Semester, CGPA
- Skills (textarea)
- Resume Upload

Actions
- Primary Button: Create Profile
- Secondary Button: Cancel

-----------------------------------------
SCREEN 6
VIEW PROFILE
-----------------------------------------

Profile Header
- Avatar, Student Name, Department, Year
- Profile Completion Badge

Profile Cards
- Personal Information
- Academic Information
- Skills

Resume Card
- Filename, Upload Date
- Download Button, Delete Button

Buttons
- Edit Profile, Upload Resume

-----------------------------------------
SCREEN 7
UPDATE PROFILE
-----------------------------------------

Same layout as Create Profile, with prefilled fields

Buttons
- Save Changes, Reset, Cancel

States
- Success Alert
- Validation Errors
- Loading State

-----------------------------------------
SCREEN 8
RESUME UPLOAD MODAL
-----------------------------------------

Bootstrap Modal
- Title: Upload Resume
- Drag & Drop Area
- Browse Button
- Selected File display
- Progress Bar
- Upload Button, Cancel Button
- Success State, Failure State

-----------------------------------------
SCREEN 9
LOGOUT MODAL
-----------------------------------------

Confirmation Modal
- Title: Logout
- Message: Are you sure you want to logout?
- Buttons: Cancel, Logout

-----------------------------------------
SCREEN 10
ERROR & EMPTY STATES
-----------------------------------------

404 Page
- Illustration Placeholder
- Heading: Page Not Found
- Button: Go Home

Empty Profile
- Icon
- Heading: No profile found
- Button: Create Profile

Network Error
- Alert, Retry Button

Loading Screen
- Spinner, Loading text

-----------------------------------------
COMPONENT LIBRARY
-----------------------------------------

Create reusable components with variants for:
Navbar, Sidebar, Primary Button, Secondary Button, Danger Button, Input, Select,
Textarea, Card, Modal, Alert, Badge, Table, Avatar, Progress Bar, File Upload,
Toast, Spinner, Breadcrumb, Dropdown, Pagination

-----------------------------------------
FIGMA REQUIREMENTS
-----------------------------------------

- Use Auto Layout everywhere
- Name layers clearly
- Use reusable components and component variants
- Follow the 8px spacing system strictly
- Create consistent desktop and mobile wireframes
- Keep everything grayscale with blue accent placeholders
- Make the wireframes developer-friendly for direct implementation in React + Bootstrap 5
