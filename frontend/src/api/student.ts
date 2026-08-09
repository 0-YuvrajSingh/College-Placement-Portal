import { http, authHeader } from "@/lib/api"
import type {
  Application,
  EducationEntry,
  Resume,
  StudentProfile,
} from "@/types"

export interface StudentProfilePayload {
  name?: string
  email?: string
  phone?: string
  department?: string
  rollNumber?: string
  registrationNumber?: string
  college?: string
  course?: string
  graduationYear?: number
  hasActiveBacklogs?: boolean
  year?: number
  skills?: string[]
  cgpa?: number
  semester?: number
  education?: EducationEntry[]
}

export const studentApi = {
  getProfile() {
    return http.get<{ profile: StudentProfile }>("/students/me/profile")
  },

  createProfile(payload: StudentProfilePayload) {
    return http.post<{ profile: StudentProfile }>("/students/me/profile", payload)
  },

  updateProfile(payload: StudentProfilePayload) {
    return http.put<{ profile: StudentProfile }>("/students/me/profile", payload)
  },

  async uploadResume(file: File): Promise<{ resume: Resume }> {
    const form = new FormData()
    form.append("resume", file)
    const res = await fetch("/api/students/me/resume", {
      method: "POST",
      headers: authHeader(),
      body: form,
    })
    const body = await res.json()
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Resume upload failed")
    }
    return body.data
  },

  deleteResume() {
    return http.delete<{ message: string }>("/students/me/resume")
  },

  myApplications(filters: { status?: string; page?: number; limit?: number }) {
    const params: Record<string, string | number | undefined> = {
      status: filters.status || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    return http.getPage<Application[]>("/student/applications", { params })
  },

  getApplication(id: string) {
    return http.get<{ application: Application }>(`/student/applications/${id}`)
  },

  withdraw(id: string) {
    return http.patch<{ application: Application }>(`/student/applications/${id}/withdraw`)
  },
}
