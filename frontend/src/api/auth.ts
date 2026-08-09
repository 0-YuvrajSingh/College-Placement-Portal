import { http } from "@/lib/api"
import type { AuthResponse, Role, User } from "@/types"

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return http.post<AuthResponse>("/auth/login", { email, password })
  },

  async register(data: {
    name: string
    email: string
    password: string
    role: Role
  }): Promise<AuthResponse> {
    return http.post<AuthResponse>("/auth/register", data)
  },

  async me(): Promise<{ user: User; profile: unknown }> {
    return http.get<{ user: User; profile: unknown }>("/auth/me")
  },

  async logout(): Promise<void> {
    await http.post<{ message: string }>("/auth/logout")
  },
}
