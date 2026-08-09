import { http } from "@/lib/api"
import type { Application, JobDetailPayload, JobListItem } from "@/types"

export interface JobFilters {
  search?: string
  location?: string
  employmentType?: string
  workMode?: string
  department?: string
  eligible?: boolean
  sortBy?: string
  order?: string
  page?: number
  limit?: number
}

export const jobsApi = {
  list(filters: JobFilters) {
    const params: Record<string, string | number | boolean | undefined> = {
      search: filters.search || undefined,
      location: filters.location || undefined,
      employmentType: filters.employmentType || undefined,
      workMode: filters.workMode || undefined,
      department: filters.department || undefined,
      eligible: filters.eligible || undefined,
      sortBy: filters.sortBy || undefined,
      order: filters.order || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<JobListItem[]>("/jobs", { params })
  },

  get(id: string) {
    return http.get<JobDetailPayload>(`/jobs/${id}`)
  },

  apply(jobId: string) {
    return http.post<{ application: Application }>(`/jobs/${jobId}/apply`)
  },
}
