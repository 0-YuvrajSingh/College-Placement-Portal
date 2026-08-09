import type { ApplicationStatus, JobStatus, Role } from "@/types"

export const ROLES: Role[] = ["student", "recruiter", "admin"]

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  recruiter: "Recruiter",
  admin: "Admin",
}

export const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical",
  "Mechanical",
  "Civil",
  "Automobile",
  "Chemical",
  "Other",
]

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship"]
export const WORK_MODES = ["On-site", "Remote", "Hybrid"]

export const JOB_STATUSES: JobStatus[] = ["DRAFT", "OPEN", "CLOSED", "EXPIRED"]

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
  EXPIRED: "Expired",
}

export const JOB_STATUS_TONES: Record<JobStatus, string> = {
  DRAFT: "muted",
  OPEN: "success",
  CLOSED: "danger",
  EXPIRED: "warning",
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "SHORTLISTED",
  "REJECTED",
  "SELECTED",
  "WITHDRAWN",
]

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  SELECTED: "Selected",
  WITHDRAWN: "Withdrawn",
}

export const APPLICATION_STATUS_TONES: Record<ApplicationStatus, string> = {
  APPLIED: "info",
  SHORTLISTED: "warning",
  REJECTED: "danger",
  SELECTED: "success",
  WITHDRAWN: "muted",
}

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  APPLIED: "#3B82F6",
  SHORTLISTED: "#F59E0B",
  REJECTED: "#EF4444",
  SELECTED: "#10B981",
  WITHDRAWN: "#94A3B8",
}

export const TRANSITIONS_BY_STATUS: Record<ApplicationStatus, ApplicationStatus[]> = {
  APPLIED: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["SELECTED", "REJECTED"],
  REJECTED: [],
  SELECTED: [],
  WITHDRAWN: [],
}

export const STUDENT_YEARS = [1, 2, 3, 4]
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

export const GRADUATION_YEARS = (() => {
  const current = new Date().getFullYear()
  const years: number[] = []
  for (let y = current - 1; y <= current + 4; y++) years.push(y)
  return years
})()
