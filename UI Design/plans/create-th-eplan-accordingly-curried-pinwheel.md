# PlaceForge UI/UX Implementation Plan

## Context

The user has provided a comprehensive design system brief for **PlaceForge**, a campus recruitment management platform for B.Tech students, recruiters, and placement coordinators. The current `App.tsx` is a placeholder dot-grid animation. The goal is to replace it with a complete, production-quality multi-role React application that feels like a real product — asymmetric layouts, role-specific UX, information-dense composition, not a generic AI dashboard.

## Aesthetic Stance

- **Stance:** Data-dense editorial — Bloomberg-meets-campus. Not SaaS-modern.
- **Fonts:** Manrope (headings/display, Google Fonts) + Inter (body/UI, Google Fonts) — wire via `@import` in `src/index.css`
- **Palette:**
  - Primary: `#0F1F3D` (deep navy)
  - Accent: `#00BFB3` (electric teal)
  - Highlight: `#F59E0B` (warm amber)
  - Background: `#F5F7FA` (cool off-white)
  - Surface: `#FFFFFF`
  - Border: `#E2E8F0`
  - Text primary: `#0F1F3D`
  - Text secondary: `#475569`
  - Text muted: `#94A3B8`
  - Success: `#10B981`, Warning: `#F59E0B`, Danger: `#EF4444`
- **Radius:** 4px inputs, 8px cards, 0px tables
- **Shadows:** Borders + surface contrast over drop shadows

## Architecture

Install `react-router-dom` and `lucide-react` (if not present). Structure:

```
src/
  App.tsx               — router shell + role-aware layout
  index.css             — font imports + Tailwind + CSS tokens
  pages/
    Landing.tsx          — public landing page
    Login.tsx            — split-layout auth
    Register.tsx         — role-adaptive registration
    student/
      Dashboard.tsx      — asymmetric composition dashboard
      Jobs.tsx           — job discovery with filters
      JobDetail.tsx      — editorial job detail + sticky side panel
      Applications.tsx   — visual application timeline
      Profile.tsx        — career profile
    recruiter/
      Dashboard.tsx      — operational overview
      JobManagement.tsx  — table-based job list
      Applicants.tsx     — filterable applicant table
      ApplicantDetail.tsx — focused applicant profile
    admin/
      Dashboard.tsx      — analytical overview
      Students.tsx       — student management table
      Recruiters.tsx     — recruiter management table
      Jobs.tsx           — jobs admin table
      Applications.tsx   — applications admin table
  components/
    layout/
      Navbar.tsx         — public nav
      Sidebar.tsx        — role-aware sidebar (student/recruiter/admin)
      AppShell.tsx       — sidebar + main content wrapper
    ui/
      Button.tsx         — primary/secondary/danger, sm/md/lg, loading
      Badge.tsx          — status badges (Applied/Shortlisted/Selected/etc.)
      Input.tsx          — text/search/select with states
      Table.tsx          — sortable, filterable data table
      Modal.tsx          — confirmation dialogs
      Toast.tsx          — notification system
      Skeleton.tsx       — skeleton loaders
    cards/
      JobCard.tsx        — featured/normal/applied/closing/ineligible variants
      MetricStrip.tsx    — horizontal stat band (not 4-equal cards)
      ApplicationItem.tsx — timeline step item
      CompanyCard.tsx
```

## Implementation Order

### Phase 1 — Foundation
1. Install `react-router-dom` + `lucide-react`
2. Wire Google Fonts in `src/index.css` (Manrope + Inter `@import` before Tailwind)
3. Add CSS custom properties (color tokens, typography scale) in `src/index.css`
4. Build `AppShell.tsx` + `Sidebar.tsx` + `Navbar.tsx`
5. Set up routes in `App.tsx` with role-based demo navigation (role switcher in sidebar)

### Phase 2 — Shared Components
6. `Button`, `Badge`, `Input`, `Table`, `Modal`, `Toast`, `Skeleton`
7. `JobCard` with all 5 variants
8. `MetricStrip` (horizontal band, not card grid)

### Phase 3 — Public Pages
9. `Landing.tsx` — hero (value prop, not giant), platform overview, how it works flow, benefits, CTA
10. `Login.tsx` + `Register.tsx` — split-layout, professional minimal

### Phase 4 — Student Experience
11. `student/Dashboard.tsx` — asymmetric: profile progress + quick actions, recommended opportunities column, application timeline column, deadlines strip
12. `student/Jobs.tsx` — search + filter bar, mixed-weight job cards, eligibility indicators
13. `student/JobDetail.tsx` — main editorial content + sticky right panel
14. `student/Applications.tsx` — visual vertical timeline per application
15. `student/Profile.tsx` — career profile sections, completeness indicator

### Phase 5 — Recruiter Experience
16. `recruiter/Dashboard.tsx` — operational composition: pipeline overview, urgent items, recent applicants
17. `recruiter/JobManagement.tsx` — dense table, status/deadline/applicant count, row actions
18. `recruiter/Applicants.tsx` — filterable table (status/branch/CGPA), progressive disclosure
19. `recruiter/ApplicantDetail.tsx` — focused profile layout + status controls

### Phase 6 — Admin Experience
20. `admin/Dashboard.tsx` — analytical: one primary overview area, stats, activity stream, placement pipeline
21. `admin/Students.tsx`, `admin/Recruiters.tsx`, `admin/Jobs.tsx`, `admin/Applications.tsx` — production-quality management tables with filter/sort/actions

## Key Design Rules (enforced in code)
- No generic equal-column 3×4 card grids
- Tables for data-heavy management (not cards)
- Visual timelines for application progression
- Sticky contextual panels on job detail
- Role switcher in sidebar for demo (Student / Recruiter / Admin)
- Empty states with contextual copy, not "No data found"
- Skeleton loaders matching content layout
- Confirmation modals for destructive actions only

## Verification
- Start dev server (already running on `$PORT`), navigate through all routes via role switcher
- Check mobile layout at ~390px width
- Verify all table interactions (sort, filter)
- Confirm no TypeScript build errors via `pnpm build`
