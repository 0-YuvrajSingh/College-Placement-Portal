# Figma AI Master Prompt — PlaceForge UI/UX Design System

## Project

**PlaceForge — Campus Recruitment Management Platform**

Design a complete, modern, production-quality UI/UX system for a **4th-year B.Tech-level campus recruitment platform**.

PlaceForge connects:

* Students
* Recruiters
* Placement Coordinators / Administrators

The product will eventually be implemented using **React.js**.

The design must therefore be:

* production-ready
* component-based
* responsive
* accessible
* scalable
* developer-friendly
* visually distinctive
* consistent
* practical to implement

---

# 1. MOST IMPORTANT DESIGN DIRECTION

Do **NOT** make the interface look AI-generated.

Avoid the typical AI-generated dashboard patterns:

* repetitive rectangular cards
* every section inside a rounded container
* excessive 12–24px border radius
* everything centered
* everything arranged in equal columns
* excessive whitespace with little information
* identical cards repeated across the page
* giant hero sections
* generic purple/blue gradients
* excessive glassmorphism
* floating blobs
* unnecessary illustrations
* excessive shadows
* perfectly symmetrical layouts everywhere
* every page following the exact same structure
* huge headings with tiny supporting content
* "SaaS template" visual language
* excessive pill-shaped buttons
* decorative elements with no functional purpose

The design must feel like it was created by an experienced **product designer for a real university recruitment platform**, not generated from a generic dashboard template.

---

# 2. CORE DESIGN PHILOSOPHY

The UI should feel:

> **Professional + energetic + trustworthy + youthful + academic + career-oriented**

The platform is used by students, recruiters, and placement coordinators.

Therefore it must balance:

```text
Professional enterprise software
        +
Modern student-facing product
        +
University credibility
        +
Recruitment platform usability
```

Do not make it childish.

Do not make it overly corporate.

Do not make it visually boring.

---

# 3. VISUAL IDENTITY

Create a distinct visual identity for PlaceForge.

The brand should communicate:

* career growth
* opportunity
* progress
* connection
* ambition
* trust
* professionalism

Use a **professional but vibrant color system**.

Avoid the standard:

```text
#6366F1 purple
#8B5CF6 purple
#3B82F6 generic SaaS blue
```

as the dominant visual identity.

Instead create a more distinctive palette.

Recommended direction:

### Primary

Deep navy / midnight blue

Used for:

* navigation
* primary branding
* headings
* important UI areas

### Primary Accent

Vibrant electric teal / cyan

Used for:

* active states
* key actions
* links
* progress indicators
* highlights

### Secondary Accent

Warm amber / energetic orange

Used selectively for:

* opportunities
* deadlines
* attention states
* important highlights

### Supporting Colors

Use restrained:

* emerald
* slate
* off-white
* cool gray

for status and supporting UI.

The final palette must remain professional.

Do not make the interface neon.

Do not use more than necessary.

---

# 4. COLOR SYSTEM

Create a complete design-token system.

Define:

```text
Primary
Primary Hover
Primary Active
Primary Soft

Accent
Accent Hover
Accent Soft

Success
Success Soft

Warning
Warning Soft

Danger
Danger Soft

Info
Info Soft

Background
Surface
Surface Elevated
Border
Text Primary
Text Secondary
Text Muted
Text Inverse
```

Create both:

* light theme
* dark theme

The light theme is the primary theme.

Dark theme should not simply invert colors.

---

# 5. TYPOGRAPHY

Use a modern professional sans-serif.

Good candidates:

* Inter
* Manrope
* Plus Jakarta Sans
* Geist

Prefer **Inter or Manrope** unless the existing brand direction suggests otherwise.

Typography should have clear hierarchy:

```text
Display
H1
H2
H3
H4
Body Large
Body
Body Small
Caption
Label
```

Avoid oversized typography everywhere.

Headings should establish hierarchy without consuming excessive screen space.

---

# 6. LAYOUT PHILOSOPHY

This is extremely important.

The UI must **NOT be linear**.

Do not design every page as:

```text
Header
↓
Hero
↓
Three cards
↓
Table
↓
Footer
```

Instead use **asymmetric, information-rich layouts**.

Use:

* split layouts
* offset sections
* varied card sizes
* horizontal content bands
* side panels
* contextual modules
* dense tables where appropriate
* visual timelines
* overlapping elements where useful
* whitespace as hierarchy
* editorial-style composition
* different content densities based on the task

However, do not make the layout chaotic.

The layout should feel intentionally designed.

---

# 7. RESPONSIVE GRID

Create a flexible grid system.

Desktop:

```text
12-column grid
```

Tablet:

```text
8-column grid
```

Mobile:

```text
4-column grid
```

Do not force every component into the same width.

Allow components to span different columns depending on importance.

Example:

```text
Large primary module → 7 columns
Secondary module → 5 columns
Supporting modules → 4/4/4
```

Use the grid as a foundation rather than a visible cage.

---

# 8. SPACING SYSTEM

Use a consistent spacing scale.

Example:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Avoid random spacing.

Do not make every section excessively spacious.

Information-heavy pages should have appropriately higher density.

---

# 9. BORDER RADIUS

Avoid excessive rounded cards.

Use a restrained radius system:

```text
4px
8px
12px
16px
```

Not every element needs rounded corners.

Use:

* subtle radius for inputs
* moderate radius for cards
* sharper corners for tables/data-heavy interfaces
* stronger radius only for major interactive modules

Avoid the "everything is a floating rounded rectangle" look.

---

# 10. SHADOWS

Use shadows sparingly.

Prefer:

* borders
* tonal separation
* surface contrast

over huge drop shadows.

Cards should often be distinguished through:

```text
surface color
+
border
+
spacing
```

rather than:

```text
white card
+
huge shadow
```

---

# 11. BRAND ELEMENT

Create a PlaceForge visual mark/logo direction.

The concept should represent:

* campus
* career
* opportunity
* connection
* forward movement

Do not use generic:

* graduation cap
* briefcase
* handshake

unless integrated into a genuinely distinctive visual system.

Create:

* logo mark
* wordmark
* favicon/app icon
* light background version
* dark background version

---

# 12. DESIGN SYSTEM

Create reusable components.

The Figma file should contain a dedicated:

## Foundations

* colors
* typography
* spacing
* grid
* radius
* shadows
* icons
* breakpoints

## Components

Create variants for:

### Buttons

* Primary
* Secondary
* Tertiary
* Destructive
* Icon button
* Loading
* Disabled

States:

* default
* hover
* active
* focus
* disabled
* loading

---

### Inputs

* text
* email
* password
* search
* select
* multi-select
* textarea
* date
* number
* file upload

States:

* default
* focus
* filled
* error
* success
* disabled

---

### Navigation

* desktop navbar
* dashboard sidebar
* mobile navigation
* breadcrumbs
* tabs

---

### Cards

Do not create only one generic card.

Create purpose-specific components:

* Job Card
* Application Card
* Company Card
* Profile Summary
* Metric Card
* Deadline Card
* Recruitment Status
* Activity Item

Each should have a distinct information hierarchy.

---

### Tables

Create:

* standard table
* sortable table
* filterable table
* selectable rows
* status cells
* action cells
* pagination

Tables should be dense and professional.

---

### Status Indicators

Use:

* Applied
* Shortlisted
* Rejected
* Selected
* Withdrawn
* Open
* Closed
* Expired
* Pending

Do not rely only on color.

Include text/icon where appropriate.

---

# 13. ICONOGRAPHY

Use a consistent icon library.

Prefer:

* Lucide
* Phosphor
* another clean outline icon system

Do not mix unrelated icon styles.

Icons should support comprehension rather than decoration.

---

# 14. STUDENT EXPERIENCE

Design the complete student journey.

The student should immediately understand:

```text
What jobs are available?
Which jobs am I eligible for?
What have I applied to?
What is my current status?
Is my profile complete?
```

---

# 15. STUDENT DASHBOARD

Do NOT create a generic dashboard with 4 equal metric cards.

Create a visually composed dashboard.

Possible layout:

```text
┌──────────────────────────────────────────────┐
│ Welcome / Profile Progress      Quick Action │
├───────────────────────────┬──────────────────┤
│                           │                  │
│ Recommended Opportunities │ Application      │
│                           │ Timeline         │
│                           │                  │
├───────────────┬───────────┴──────────────────┤
│ Upcoming      │ Recent Applications           │
│ Deadlines     │                               │
└───────────────┴───────────────────────────────┘
```

But do not copy this literally.

Use an asymmetric composition.

Include:

* profile completion
* eligible opportunities
* recent applications
* upcoming deadlines
* application progress
* resume status

---

# 16. STUDENT JOB DISCOVERY

This should be one of the strongest screens.

Create:

## Jobs / Opportunities

Features:

* search
* filters
* sort
* eligibility indicator
* job cards
* company information
* deadline
* salary
* location
* employment type
* skills

Use different visual weights for:

```text
Featured opportunity
Normal opportunity
Already applied
Ineligible opportunity
Closing soon
```

Do not make every job card identical.

---

# 17. JOB DETAILS PAGE

Design a high-quality recruitment job detail page.

Include:

```text
Company identity
Job title
Location
Employment type
Salary/package
Deadline
Eligibility
Required skills
Job description
Responsibilities
Requirements
Application CTA
Application status
```

Use a sticky contextual application panel on desktop.

Example composition:

```text
Main Content                         Side Panel
────────────────────────            ─────────────
Job Overview                         Apply Now
Description                         Deadline
Responsibilities                    Eligibility
Requirements                        Application status
Skills
```

The side panel should remain visually distinct.

---

# 18. APPLICATION TRACKING

Create a visual application timeline.

Example:

```text
Applied
   │
   ●
   │
Shortlisted
   │
   ●
   │
Interview / Review
   │
   ●
   │
Selected
```

Do not create unnecessary complexity.

Use the actual application states supported by the backend.

---

# 19. STUDENT PROFILE

Create a professional career profile.

Sections:

* personal information
* academic information
* skills
* education
* resume
* profile completeness

Profile should feel closer to a professional career profile than a basic CRUD form.

---

# 20. RESUME MANAGEMENT

Create an elegant resume section.

Show:

* uploaded resume
* file name
* upload date
* file type
* replace button
* download/view button
* delete button where supported

Include a clear visual state:

```text
Resume uploaded
Profile ready for applications
```

Do not create fake resume previews if the backend does not support preview.

---

# 21. RECRUITER EXPERIENCE

Recruiter UI should feel different from student UI.

It should be:

* data-oriented
* efficient
* professional
* slightly denser

Recruiter should immediately understand:

```text
How many jobs are active?
How many applicants exist?
Which applicants need review?
Which jobs are closing soon?
```

---

# 22. RECRUITER DASHBOARD

Avoid four equal cards.

Create a composition such as:

* active recruitment overview
* applicant pipeline
* job performance
* upcoming deadlines
* recent applicants
* quick actions

Use data visualization only where useful.

Do not create meaningless charts.

---

# 23. JOB MANAGEMENT

Create a professional job-management workspace.

Include:

* job list
* status
* deadline
* applicant count
* created date
* actions

Actions:

* view
* edit
* close
* delete/deactivate

Use tables for data-heavy management rather than cards.

---

# 24. APPLICANT MANAGEMENT

Create a recruiter applicant-review interface.

Include:

* student name
* branch
* CGPA
* skills
* application date
* current status
* resume
* action

Allow filtering by:

* status
* branch
* CGPA
* skills

Do not overcrowd the table.

Use progressive disclosure where appropriate.

---

# 25. APPLICANT DETAIL

Create a focused applicant profile.

Layout:

```text
Student identity
Academic summary
Skills
Resume
Application information
Status controls
```

Status actions should be obvious but not visually aggressive.

---

# 26. ADMIN EXPERIENCE

Admin UI should be distinctly more operational.

It should prioritize:

* overview
* management
* moderation
* placement activity
* data tables

Admin interface should be more information-dense than student UI.

---

# 27. ADMIN DASHBOARD

Create:

* student count
* recruiter count
* active jobs
* total applications
* shortlisted
* selected

But do not make six identical metric cards.

Use:

* one primary overview area
* supporting statistics
* activity stream
* placement pipeline
* management shortcuts

---

# 28. ADMIN TABLES

Create production-quality management tables.

Students:

```text
Student
Branch
CGPA
Graduation Year
Status
Applications
Actions
```

Recruiters:

```text
Company
Recruiter
Jobs
Status
Created
Actions
```

Jobs:

```text
Job
Company
Status
Deadline
Applicants
Created
Actions
```

Applications:

```text
Student
Job
Company
Applied
Status
Actions
```

---

# 29. SEARCH AND FILTER UX

Search should not look like a generic search box.

Use contextual search.

For jobs:

```text
Search opportunities
[Location]
[Branch]
[Employment type]
[Eligibility]
[Deadline]
```

For admin/recruiter tables:

```text
Search
Filters
Sort
Export only if later supported
```

Avoid excessive filter controls by default.

Use filter drawers/popovers where appropriate.

---

# 30. EMPTY STATES

Create meaningful empty states.

Examples:

### No Jobs

> No opportunities match your current filters.

### No Applications

> You haven't applied to any opportunities yet.

### No Applicants

> Applications will appear here when students apply.

Avoid generic:

> "No data found."

---

# 31. ERROR STATES

Design:

* 404
* unauthorized
* forbidden
* server error
* network error
* validation errors

Errors should explain:

```text
What happened
+
What the user can do
```

---

# 32. LOADING STATES

Create:

* skeleton loaders
* button loading
* table loading
* page loading
* file upload progress

Do not use loading spinners everywhere.

Skeletons should match the underlying content layout.

---

# 33. NOTIFICATIONS

Create a notification/toast system for:

* successful application
* profile update
* resume upload
* job creation
* status update
* validation error
* authorization error

Do not make notifications intrusive.

---

# 34. MODALS AND CONFIRMATION

Use confirmation dialogs for destructive actions:

* delete job
* deactivate account
* remove resume
* withdraw application

Do not use confirmation dialogs for every action.

---

# 35. RESPONSIVE DESIGN

Design at minimum:

### Desktop

1440px

### Laptop

1280px

### Tablet

768px

### Mobile

390px

Do not simply shrink the desktop layout.

Recompose content for mobile.

For example:

Desktop:

```text
Main content + side panel
```

Mobile:

```text
Main content
↓
Application panel
```

Tables should become:

* horizontally scrollable
* condensed
* or transformed into cards

depending on information density.

---

# 36. DARK MODE

Create a dark mode.

Dark mode should preserve hierarchy.

Do not use pure black backgrounds everywhere.

Use:

```text
deep navy
dark slate
elevated surfaces
muted borders
bright accent colors
```

Ensure readable contrast.

---

# 37. MICRO-INTERACTIONS

Use restrained interaction design.

Examples:

* button hover
* card hover
* status transition
* tab transition
* filter opening
* modal animation
* upload progress
* success confirmation

Animations should be fast and purposeful.

Do not turn the application into an animated landing page.

---

# 38. LANDING PAGE

Create a professional public landing page.

It should communicate:

> **One platform for campus recruitment.**

Sections:

### Hero

Clear value proposition.

Example concept:

**From campus opportunity to career.**

Supporting text explaining how PlaceForge connects students, recruiters, and placement teams.

CTA:

* Explore Opportunities
* Recruiter Login

Do not use generic AI illustrations.

---

### Platform Overview

Explain:

```text
Students
Recruiters
Placement Teams
```

Use a visual relationship rather than three identical cards.

---

### How It Works

Show:

```text
Discover
→
Apply
→
Review
→
Get Selected
```

Use a horizontal flow on desktop and a compact vertical version on mobile.

---

### Benefits

Show practical benefits:

Students:

* discover relevant opportunities
* track applications
* maintain career profile

Recruiters:

* manage openings
* review applicants
* streamline recruitment

Placement Teams:

* centralize placement activity
* manage participants
* monitor recruitment

---

# 39. LOGIN / REGISTER

Authentication pages should be professional and minimal.

Avoid giant illustrations.

Use split layouts where appropriate.

Example:

```text
Left:
Brand + short value proposition

Right:
Login / registration form
```

Registration should adapt based on role.

Do not overload the registration screen.

---

# 40. ACCESSIBILITY

Ensure:

* WCAG-conscious contrast
* keyboard navigation
* visible focus states
* proper form labels
* meaningful error states
* accessible modal behavior
* accessible status indicators
* minimum comfortable touch targets

Do not communicate status using color alone.

---

# 41. COMPONENT VARIANTS

Use Figma variants extensively.

Examples:

```text
Button
  type = primary / secondary / danger
  size = sm / md / lg
  state = default / hover / disabled / loading

Status
  type = applied / shortlisted / rejected / selected

Input
  state = default / focus / error / success / disabled

JobCard
  state = default / featured / applied / closing / ineligible
```

Use Auto Layout.

Use components instead of detached copies.

---

# 42. DESIGN TOKENS

Create reusable variables for:

* colors
* typography
* spacing
* radii
* shadows
* breakpoints

The design must be implementable in React without manually guessing values.

---

# 43. FIGMA FILE STRUCTURE

Organize the Figma file as:

```text
01 — Cover
02 — Brand
03 — Foundations
04 — Components
05 — Patterns
06 — Public Pages
07 — Student
08 — Recruiter
09 — Admin
10 — Responsive
11 — Prototypes
```

Do not mix components and final screens randomly.

---

# 44. PROTOTYPE FLOWS

Create clickable prototype flows for the most important journeys.

### Student

```text
Login
→ Dashboard
→ Jobs
→ Job Details
→ Apply
→ Application Status
```

### Recruiter

```text
Login
→ Dashboard
→ Jobs
→ Create Job
→ Applicants
→ Applicant Detail
→ Update Status
```

### Admin

```text
Login
→ Dashboard
→ Students
→ Recruiters
→ Jobs
→ Applications
```

---

# 45. DESIGN QUALITY BAR

Before finalizing the design, inspect every screen for:

### Visual hierarchy

Can the user immediately identify the primary action?

### Density

Does the page contain enough useful information without feeling cluttered?

### Alignment

Are elements aligned intentionally?

### Consistency

Are components reused consistently?

### Differentiation

Do student, recruiter, and admin interfaces feel appropriately different?

### Responsiveness

Does the layout adapt instead of simply shrinking?

### Accessibility

Are controls readable and usable?

### Originality

Does the design avoid looking like a generic AI-generated dashboard?

---

# 46. AVOID THESE DESIGN PATTERNS

Absolutely avoid:

```text
❌ Generic purple SaaS dashboard
❌ 3x3 card grid everywhere
❌ Every element inside a rounded rectangle
❌ Excessive glassmorphism
❌ Huge gradients
❌ Floating blobs
❌ Random decorative 3D objects
❌ Generic stock illustrations
❌ Excessive shadows
❌ Everything centered
❌ Identical dashboard layouts for all roles
❌ Huge hero text taking half the screen
❌ Fake statistics
❌ Fake charts
❌ Unnecessary animations
❌ Excessive pill UI
❌ Decorative icons everywhere
```

---

# 47. WHAT THE DESIGN SHOULD FEEL LIKE

The final product should feel like a combination of:

```text
Modern university platform
        +
Professional recruitment software
        +
Contemporary career product
```

It should feel credible enough that a recruiter viewing the portfolio thinks:

> "This is a real product someone could actually use."

Not:

> "This is an AI-generated college dashboard."

---

# 48. DESIGN PRINCIPLE

The central principle is:

> **Structure should follow the user's task, not force every page into the same template.**

Student job discovery should feel exploratory.

Recruiter management should feel operational.

Admin management should feel analytical.

Profile management should feel personal.

Authentication should feel focused.

Job details should feel editorial and information-rich.

Do not force them into one universal layout.

---

# 49. FINAL DELIVERABLE

Create a complete Figma UI/UX system for PlaceForge containing:

* brand identity
* color system
* typography
* spacing system
* design tokens
* component library
* responsive system
* landing page
* authentication
* student experience
* recruiter experience
* admin experience
* job discovery
* job details
* application tracking
* profiles
* resume management
* applicant management
* admin management
* loading states
* empty states
* error states
* confirmation dialogs
* responsive variants
* dark mode
* interactive prototypes

The design must be **coherent as one product but intentionally different across user roles**.

---

# FINAL INSTRUCTION TO FIGMA AI

Do not generate a generic dashboard template.

Do not optimize for visual symmetry.

Do not make every component a card.

Do not make every page follow the same vertical structure.

Design PlaceForge as a **real campus recruitment product** with strong information hierarchy, varied layouts, purposeful density, professional typography, a distinctive vibrant color system, and task-specific UX.

Use asymmetry and composition intentionally.

Use whitespace strategically.

Use color to establish hierarchy rather than decoration.

Use cards only where they improve information grouping.

Use tables where data density requires tables.

Use timelines where progression matters.

Use side panels where contextual actions matter.

Use large visual areas only where they provide actual product value.

The result must be **modern, professional, vibrant, distinctive, responsive, accessible, and realistically implementable in React**.

Most importantly:

> **It must not look like an AI-generated linear UI.**
