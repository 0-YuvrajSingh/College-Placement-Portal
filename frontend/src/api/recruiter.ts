import { downloadWithAuth, http } from "@/lib/api"
import type {
  ApplicationStatus,
  Job,
  JobStatus,
  RecruiterApplication,
  RecruiterProfile,
  RecruiterStats,
} from "@/types"

export interface JobPayload {
  title: string
  description: string
  companyName: string
  location?: string
  employmentType?: string
  workMode?: string
  salary?: { min?: number; max?: number; currency?: string }
  skills?: string[]
  eligibility?: {
    minimumCgpa?: number
    eligibleDepartments?: string[]
    eligibleGraduationYears?: number[]
    requiredSkills?: string[]
    backlogAllowed?: boolean
  }
  applicationDeadline: string
  status?: JobStatus
}

export const recruiterApi = {
  getProfile() {
    return http.get<{ profile: RecruiterProfile }>("/recruiter/profile")
  },

  updateProfile(payload: Partial<RecruiterProfile>) {
    return http.put<{ profile: RecruiterProfile }>("/recruiter/profile", payload)
  },

  stats() {
    return http.get<RecruiterStats>("/recruiter/stats")
  },

  listJobs(filters: { status?: string; page?: number; limit?: number }) {
    const params: Record<string, string | number | undefined> = {
      status: filters.status || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<(Job & { applicantCount: number })[]>("/recruiter/jobs", { params })
  },

  getJob(id: string) {
    return http.get<{ job: Job }>(`/recruiter/jobs/${id}`)
  },

  createJob(payload: JobPayload) {
    return http.post<{ job: Job }>("/recruiter/jobs", payload)
  },

  updateJob(id: string, payload: Partial<JobPayload>) {
    return http.put<{ job: Job }>(`/recruiter/jobs/${id}`, payload)
  },

  changeJobStatus(id: string, status: JobStatus) {
    return http.patch<{ job: Job }>(`/recruiter/jobs/${id}/status`, { status })
  },

  deleteJob(id: string) {
    return http.delete<{ message: string }>(`/recruiter/jobs/${id}`)
  },

  jobApplications(jobId: string, filters: { status?: string; page?: number; limit?: number }) {
    const params: Record<string, string | number | undefined> = {
      status: filters.status || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<RecruiterApplication[]>(`/recruiter/jobs/${jobId}/applications`, { params })
  },

  listApplications(filters: { status?: string; jobId?: string; search?: string; page?: number; limit?: number }) {
    const params: Record<string, string | number | undefined> = {
      status: filters.status || undefined,
      jobId: filters.jobId || undefined,
      search: filters.search || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<RecruiterApplication[]>("/recruiter/applications", { params })
  },

  getApplication(id: string) {
    return http.get<RecruiterApplication>(`/recruiter/applications/${id}`)
  },

  updateApplicationStatus(id: string, status: ApplicationStatus, remarks?: string) {
    return http.patch<{ application: RecruiterApplication }>(
      `/recruiter/applications/${id}/status`,
      { status, remarks },
    )
  },

  applicationResume(id: string, filename?: string) {
    return downloadWithAuth(`/recruiter/applications/${id}/resume`, filename || "resume")
  },
}
