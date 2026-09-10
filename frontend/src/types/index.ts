export type Role = "student" | "recruiter" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  isActive: boolean
  lastLoginAt?: string | null
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Resume {
  filename: string
  originalname: string
  path: string
  mimetype: string
  size: number
  uploadedAt: string
}

export interface EducationEntry {
  degree?: string
  institution?: string
  startYear?: number
  endYear?: number
  percentage?: number
}

export interface StudentProfile {
  _id: string
  user: string
  name: string
  email: string
  phone: string
  department: string
  rollNumber?: string
  registrationNumber?: string
  college?: string
  course?: string
  graduationYear?: number
  hasActiveBacklogs: boolean
  year: number
  skills: string[]
  cgpa: number
  semester: number
  education: EducationEntry[]
  profileCompleted: boolean
  isPlaced: boolean
  resume: Resume | null
}

export interface RecruiterProfile {
  _id: string
  user: string
  companyName: string
  companyDescription?: string
  website?: string
  industry?: string
  location?: string
  contactPerson?: string
  contactPhone?: string
  companySize?: string
  isApproved: boolean
}

export interface Salary {
  min?: number
  max?: number
  currency?: string
}

export interface Eligibility {
  minimumCgpa: number
  eligibleDepartments: string[]
  eligibleGraduationYears: number[]
  requiredSkills: string[]
  backlogAllowed: boolean
}

export type JobStatus = "DRAFT" | "OPEN" | "CLOSED" | "EXPIRED"

export interface Job {
  _id: string
  recruiter: string
  title: string
  description?: string
  companyName: string
  location?: string
  employmentType: string
  workMode: string
  salary: Salary | null
  skills: string[]
  eligibility: Eligibility
  applicationDeadline: string
  status: JobStatus
  createdAt: string
  updatedAt: string
}

export interface JobListItem extends Job {
  applicantCount: number
  isEligible: boolean | null
  applied: boolean
}

export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "REJECTED"
  | "SELECTED"
  | "WITHDRAWN"

export interface StatusHistoryEntry {
  status: ApplicationStatus
  changedBy: string
  changedAt: string
  remarks?: string
}

export interface ResumeSnapshot {
  originalName?: string
  storedName?: string
  mimeType?: string
  size?: number
}

export interface Application {
  _id: string
  student: string | { _id: string; name: string; email: string }
  job:
    | string
    | {
        _id: string
        title: string
        companyName: string
        location?: string
        status?: JobStatus
        applicationDeadline?: string
        employmentType?: string
        salary?: Salary | null
        skills?: string[]
      }
  recruiter: string
  resumeSnapshot: ResumeSnapshot | null
  status: ApplicationStatus
  appliedAt: string
  withdrawnAt?: string | null
  remarks?: string
  statusHistory: StatusHistoryEntry[]
}

export interface AdminApplication extends Omit<Application, "student"> {
  student: { _id: string; name: string; email: string }
  job: { _id: string; title: string; companyName: string; location?: string; status?: JobStatus }
}

export interface RecruiterApplication extends Application {
  student: { _id: string; name: string; email: string }
  job: { _id: string; title: string; companyName: string; location?: string; status?: JobStatus; applicationDeadline?: string }
  studentProfile?: Partial<StudentProfile> | null
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  pagination?: Pagination
}

export interface PublicStats {
  totalStudents: number
  activeStudents: number
  totalRecruiters: number
  activeRecruiters: number
  totalJobs: number
  openJobs: number
  totalApplications: number
  shortlistedApplications: number
  selectedApplications: number
  placedStudents: number
  placementRate: number
  highestPackage: number | null
}

export interface RecruiterStats {
  totalJobs: number
  activeJobs: number
  closingSoon: number
  totalApplicants: number
  applied: number
  shortlisted: number
  rejected: number
  selected: number
  withdrawn: number
}

export interface AdminStats {
  totalStudents: number
  activeStudents: number
  totalRecruiters: number
  activeRecruiters: number
  totalJobs: number
  openJobs: number
  totalApplications: number
  shortlistedApplications: number
  selectedApplications: number
  placedStudents: number
}

export interface AdminUserRow {
  _id: string
  name: string
  email: string
  role: Role
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt?: string
  studentProfile?: Partial<StudentProfile> | null
  recruiterProfile?: Partial<RecruiterProfile> | null
  jobCount?: number
}

export interface AuditChange {
  field: string
  before: unknown
  after: unknown
}

export interface AuditLogEntry {
  _id: string
  actor: { _id: string; name: string; email: string; role: Role } | null
  actorRole: Role
  action: string
  targetType: string
  targetId: string | null
  description: string
  changes: AuditChange[]
  ip: string
  createdAt: string
}

export interface JobDetailPayload {
  job: Job
  isEligible: boolean | null
  eligibilityReasons: string[] | null
  applied?: boolean
}
