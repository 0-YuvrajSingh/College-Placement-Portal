import { downloadWithAuth, http } from "@/lib/api"
import type {
  AdminApplication,
  AdminStats,
  AdminUserRow,
  Job,
  JobStatus,
  PublicStats,
} from "@/types"

export const adminApi = {
  stats() {
    return http.get<AdminStats>("/admin/dashboard")
  },

  listStudents(filters: { search?: string; isActive?: boolean; isPlaced?: boolean; page?: number; limit?: number }) {
    const params: Record<string, string | number | boolean | undefined> = {
      search: filters.search || undefined,
      isActive: filters.isActive,
      isPlaced: filters.isPlaced,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<AdminUserRow[]>("/admin/students", { params })
  },

  getStudent(id: string) {
    return http.get<AdminUserRow & { profile: unknown }>(`/admin/students/${id}`)
  },

  updateStudentStatus(id: string, isActive: boolean, isPlaced?: boolean) {
    return http.patch<{ user: AdminUserRow }>(`/admin/students/${id}/status`, {
      isActive,
      isPlaced,
    })
  },

  listRecruiters(filters: { search?: string; isActive?: boolean; page?: number; limit?: number }) {
    const params: Record<string, string | number | boolean | undefined> = {
      search: filters.search || undefined,
      isActive: filters.isActive,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<AdminUserRow[]>("/admin/recruiters", { params })
  },

  getRecruiter(id: string) {
    return http.get<AdminUserRow & { profile: unknown }>(`/admin/recruiters/${id}`)
  },

  updateRecruiterStatus(id: string, isActive: boolean, isApproved?: boolean) {
    return http.patch<{ user: AdminUserRow }>(`/admin/recruiters/${id}/status`, {
      isActive,
      isApproved,
    })
  },

  listJobs(filters: { search?: string; status?: string; page?: number; limit?: number }) {
    const params: Record<string, string | number | undefined> = {
      search: filters.search || undefined,
      status: filters.status || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<(Job & { applicantCount: number; recruiter?: { name: string; email: string } })[]>(
      "/admin/jobs",
      { params },
    )
  },

  getJob(id: string) {
    return http.get<{ job: Job & { recruiter?: { name: string; email: string } } }>(
      `/admin/jobs/${id}`,
    )
  },

  updateJobStatus(id: string, status: JobStatus) {
    return http.patch<{ job: Job }>(`/admin/jobs/${id}/status`, { status })
  },

  listApplications(filters: { search?: string; status?: string; jobId?: string; page?: number; limit?: number }) {
    const params: Record<string, string | number | undefined> = {
      search: filters.search || undefined,
      status: filters.status || undefined,
      jobId: filters.jobId || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<AdminApplication[]>("/admin/applications", { params })
  },

  getApplication(id: string) {
    return http.get<AdminApplication & { studentProfile: unknown }>(
      `/admin/applications/${id}`,
    )
  },

  applicationResume(id: string, filename?: string) {
    return downloadWithAuth(`/admin/applications/${id}/resume`, filename || "resume")
  },
}

export const publicApi = {
  stats() {
    return http.get<PublicStats>("/stats")
  },
}
