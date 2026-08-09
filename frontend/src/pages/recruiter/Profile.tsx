import { useEffect, useState, type FormEvent } from "react"
import { Building2 } from "lucide-react"
import { recruiterApi } from "@/api/recruiter"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"
import { PageHeader, Field, Spinner } from "@/components/ui"
import type { RecruiterProfile } from "@/types"

const SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"]

export default function Profile() {
  const { refreshProfile } = useAuth()
  const { success, error: toastError } = useToast()
  const [form, setForm] = useState<Partial<RecruiterProfile> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    recruiterApi
      .getProfile()
      .then(({ profile }) => setForm({ ...profile }))
      .catch(() => setForm({}))
      .finally(() => setLoading(false))
  }, [])

  const set = (patch: Partial<RecruiterProfile>) => setForm((prev) => ({ ...prev, ...patch }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form?.companyName?.trim()) {
      toastError("Company name is required")
      return
    }
    setSaving(true)
    try {
      await recruiterApi.updateProfile(form)
      await refreshProfile()
      success("Company profile saved")
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not save profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Company Profile" />
        <div className="page-body"><div className="empty-state"><Spinner size={26} /><span className="pf-muted">Loading profile…</span></div></div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Company Profile"
        subtitle="This information is shared with students when they view your postings."
        actions={<div className="pf-flex-center" style={{ gap: 8, color: "var(--pf-text-muted)", fontSize: 12.5 }}><Building2 size={15} /> {form?.companyName || "Not set yet"}</div>}
      />
      <div className="page-body">
        <div className="card-section" style={{ maxWidth: 760 }}>
          <div className="card-section-header"><h2>Company details</h2></div>
          <form onSubmit={onSubmit} noValidate>
            <div className="card-section-body">
              <div className="grid-2">
                <Field label="Company name *">
                  <input className="input" value={form?.companyName ?? ""} onChange={(e) => set({ companyName: e.target.value })} />
                </Field>
                <Field label="Industry">
                  <input className="input" value={form?.industry ?? ""} onChange={(e) => set({ industry: e.target.value })} placeholder="e.g. Software, Banking" />
                </Field>
                <Field label="Location">
                  <input className="input" value={form?.location ?? ""} onChange={(e) => set({ location: e.target.value })} placeholder="e.g. Bengaluru" />
                </Field>
                <Field label="Website">
                  <input className="input" type="url" value={form?.website ?? ""} onChange={(e) => set({ website: e.target.value })} placeholder="https://…" />
                </Field>
                <Field label="Contact person">
                  <input className="input" value={form?.contactPerson ?? ""} onChange={(e) => set({ contactPerson: e.target.value })} />
                </Field>
                <Field label="Contact phone">
                  <input className="input" value={form?.contactPhone ?? ""} onChange={(e) => set({ contactPhone: e.target.value.replace(/[^0-9]/g, "").slice(0, 15) })} placeholder="10-15 digits" />
                </Field>
                <Field label="Company size">
                  <select className="select" value={form?.companySize ?? ""} onChange={(e) => set({ companySize: e.target.value })}>
                    <option value="">Select size</option>
                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ marginTop: 16 }}>
                <Field label="Company description">
                  <textarea className="textarea" value={form?.companyDescription ?? ""} onChange={(e) => set({ companyDescription: e.target.value })} placeholder="Tell students about your company…" />
                </Field>
              </div>
              <div className="pf-gap-8" style={{ marginTop: 22 }}>
                <button className="btn btn-primary btn-md" type="submit" disabled={saving}>
                  {saving ? <Spinner size={14} /> : null}
                  {saving ? "Saving…" : "Save profile"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
