import axios, { AxiosError } from "axios"
import type { ApiResponse, Pagination } from "@/types"

export const TOKEN_KEY = "pf_token"

export class ApiError extends Error {
  code: string
  status: number

  constructor(message: string, code = "ERROR", status = 500) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
  }
}

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const data = error.response?.data
    const status = error.response?.status
    const message =
      data?.message ||
      (error.code === "ERR_NETWORK"
        ? "Cannot reach the server. Is it running?"
        : "Something went wrong. Please try again.")
    throw new ApiError(message, data?.code || "ERROR", status || 0)
  },
)

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>
}

async function unwrap<T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await p
  return data.data
}

async function unwrapWithPagination<T>(
  p: Promise<{ data: ApiResponse<T> }>,
): Promise<{ data: T; pagination: Pagination }> {
  const { data } = await p
  return {
    data: data.data,
    pagination: data.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  }
}

export const http = {
  get: <T>(url: string, options?: RequestOptions) =>
    unwrap<T>(api.get(url, { params: options?.params })),
  getPage: <T>(url: string, options?: RequestOptions) =>
    unwrapWithPagination<T>(api.get(url, { params: options?.params })),
  post: <T>(url: string, body?: unknown) => unwrap<T>(api.post(url, body)),
  put: <T>(url: string, body?: unknown) => unwrap<T>(api.put(url, body)),
  patch: <T>(url: string, body?: unknown) => unwrap<T>(api.patch(url, body)),
  delete: <T>(url: string) => unwrap<T>(api.delete(url)),
}

export function authHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function resumeDownloadUrl(path: string): string {
  return `/api${path}`
}

export async function downloadWithAuth(path: string, filename: string): Promise<void> {
  const res = await fetch(`/api${path}`, { headers: authHeader() })
  if (!res.ok) {
    let message = "Download failed"
    try {
      const body = await res.json()
      if (body?.message) message = body.message
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename || "resume"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
