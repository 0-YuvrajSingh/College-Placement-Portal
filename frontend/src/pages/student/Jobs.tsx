import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Banknote, CheckCircle, Clock, Lock, MapPin, Search, SlidersHorizontal, Users, X } from "lucide-react"
import { jobsApi } from "@/api/jobs"
import { ApiError } from "@/lib/api"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { Badge, EmptyState, JobStatusBadge, PageLoader, Pagination } from "@/components/ui"
import { DEPARTMENTS, EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/constants"
import { cx, formatDate, formatSalary, initials, isClosingSoon } from "@/lib/format"
import type { JobListItem } from "@/types"

const TYPES = ["All", ...EMPLOYMENT_TYPES]
const SORT_OPTIONS = ["Deadline (Soonest)", "Package (Highest)", "Applicants (Fewest)"]

function LogoMark({ name }: { name: string }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: "var(--pf-navy)",
        color: "var(--pf-teal)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Manrope",
        fontWeight: 800,
        fontSize: 12,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  )
}

function JobCard({ job }: { job: JobListItem }) {
  const navigate = useNavigate()
  const closing = isClosingSoon(job.applicationDeadline)
  const ineligible = job.isEligible === false

  const borderLeft = closing
    ? "3px solid var(--pf-amber)"
    : job.applied
      ? "3px solid #8b5cf6"
      : ineligible
        ? "3px solid var(--pf-border)"
        : "3px solid transparent"

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      style={{
        background: "var(--pf-surface)",
        border: "1px solid var(--pf-border)",
        borderLeft,
        borderRadius: 8,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "box-shadow 0.15s, border-color 0.15s",
        opacity: ineligible ? 0.65 : 1,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!ineligible) (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(15,31,61,0.08)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = "none"
      }}
    >
      {closing && (
        <div style={{ position: "absolute", top: 14, right: 16, display: "flex", alignItems: "center", gap: 4, color: "var(--pf-amber)", fontSize: 11, fontWeight: 600 }}>
          <AlertTriangle size={12} /> Closing Soon
        </div>
      )}
      {ineligible && (
        <div style={{ position: "absolute", top: 14, right: 16, display: "flex", alignItems: "center", gap: 4, color: "var(--pf-text-muted)", fontSize: 11, fontWeight: 600 }}>
          <Lock size={12} /> Ineligible
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <LogoMark name={job.companyName} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: "var(--pf-text)", lineHeight: 1.3 }}>
            {job.title}
          </div>
          <div style={{ color: "var(--pf-text-secondary)", fontSize: 13, marginTop: 2 }}>{job.companyName}</div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 10, color: "var(--pf-text-secondary)", fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{job.location || "Location not specified"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Banknote size={12} />{formatSalary(job.salary)}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />Deadline: {formatDate(job.applicationDeadline)}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{job.applicantCount} applicants</span>
          </div>

          {job.skills.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {job.skills.slice(0, 5).map((s) => (
                <span key={s} style={{ padding: "2px 8px", borderRadius: 4, background: "var(--pf-surface-elevated)", border: "1px solid var(--pf-border)", fontSize: 11, color: "var(--pf-text-secondary)", fontWeight: 500 }}>
                  {s}
                </span>
              ))}
              {job.skills.length > 5 && (
                <span style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>+{job.skills.length - 5}</span>
              )}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, gap: 12, flexWrap: "wrap" }}>
            <div className="pf-gap-8" style={{ flexWrap: "wrap" }}>
              <JobStatusBadge status={job.status} />
              <Badge tone="muted">{job.employmentType}</Badge>
              {job.applied && (
                <Badge tone="info"><CheckCircle size={11} /> Applied</Badge>
              )}
            </div>
            {job.isEligible !== false && !job.applied && (
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/jobs/${job._id}`)
                }}
              >
                View & Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Jobs() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [type, setType] = useState("All")
  const [department, setDepartment] = useState("All")
  const [workMode, setWorkMode] = useState("All")
  const [eligibleOnly, setEligibleOnly] = useState(false)
  const [sort, setSort] = useState(SORT_OPTIONS[0])
  const [page, setPage] = useState(1)

  const [jobs, setJobs] = useState<JobListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const sortConfig: Record<string, { sortBy: string; order: string }> = {
        "Deadline (Soonest)": { sortBy: "applicationDeadline", order: "asc" },
        "Package (Highest)": { sortBy: "salary", order: "desc" },
      }
      const conf = sortConfig[sort]
      const { data, pagination } = await jobsApi.list({
        search: debouncedSearch || undefined,
        employmentType: type === "All" ? undefined : type,
        department: department === "All" ? undefined : department,
        workMode: workMode === "All" ? undefined : workMode,
        eligible: eligibleOnly || undefined,
        sortBy: conf?.sortBy,
        order: conf?.order,
        page,
        limit: 10,
      })
      setJobs(data)
      setTotal(pagination.total)
      setTotalPages(pagination.totalPages)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load opportunities")
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, type, department, workMode, eligibleOnly, sort, page])

  useEffect(() => {
    void load()
  }, [load])

  const ordered = useMemo(() => {
    if (sort !== "Applicants (Fewest)") return jobs
    return [...jobs].sort((a, b) => a.applicantCount - b.applicantCount)
  }, [jobs, sort])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Opportunities</h1>
        <p className="page-subtitle">{loading ? "Loading openings…" : `${total} opening${total === 1 ? "" : "s"} match your profile`}</p>
      </div>

      <div style={{ padding: "20px 32px", background: "var(--pf-surface)", borderBottom: "1px solid var(--pf-border)" }}>
        <div style={{ position: "relative", marginBottom: 14, maxWidth: 480 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--pf-text-muted)" }} />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by role, company, or skill…"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--pf-text-muted)", padding: 0 }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <div className="pf-flex-center" style={{ color: "var(--pf-text-secondary)", fontSize: 12, fontWeight: 600 }}>
            <SlidersHorizontal size={13} /> Type:
          </div>
          {TYPES.map((t) => (
            <button
              key={t}
              className={cx("chip", t === type && "chip-active")}
              onClick={() => {
                setType(t)
                setPage(1)
              }}
            >
              {t}
            </button>
          ))}

          <div style={{ width: 1, height: 20, background: "var(--pf-border)", margin: "0 4px" }} />
          <div className="pf-flex-center" style={{ color: "var(--pf-text-secondary)", fontSize: 12, fontWeight: 600 }}>
            Branch:
          </div>
          <select
            className="select"
            style={{ width: 200 }}
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value)
              setPage(1)
            }}
          >
            <option value="All">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            className="select"
            style={{ width: 130 }}
            value={workMode}
            onChange={(e) => {
              setWorkMode(e.target.value)
              setPage(1)
            }}
          >
            <option value="All">All modes</option>
            {WORK_MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, color: eligibleOnly ? "var(--pf-teal)" : "var(--pf-text-secondary)" }}>
            <input
              type="checkbox"
              checked={eligibleOnly}
              onChange={(e) => {
                setEligibleOnly(e.target.checked)
                setPage(1)
              }}
              style={{ accentColor: "var(--pf-teal)" }}
            />
            Eligible only
          </label>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>Sort:</span>
            <select
              className="select"
              style={{ width: 180 }}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setPage(1)
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          <PageLoader label="Loading opportunities…" />
        ) : error ? (
          <EmptyState
            title="Could not load opportunities"
            message={error}
            action={<button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>}
          />
        ) : ordered.length === 0 ? (
          <EmptyState
            icon={<Search size={36} />}
            title="No opportunities match your filters"
            message="Try adjusting your search or removing some filters."
          />
        ) : (
          <>
            {ordered.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>
    </>
  )
}
