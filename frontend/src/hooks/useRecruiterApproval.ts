import { useAuth } from "@/context/AuthContext"
import type { RecruiterProfile } from "@/types"

// True when the signed-in recruiter's company has not yet been approved by the
// placement office. Recruitment operations are disabled while pending.
export function useRecruiterApproval() {
  const { profile, status } = useAuth()
  const recruiter = profile as RecruiterProfile | null
  const pending =
    status === "authenticated" && !!recruiter && recruiter.isApproved === false
  return { pending, recruiter }
}
