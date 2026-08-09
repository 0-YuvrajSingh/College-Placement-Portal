const checkEligibility = (student, job) => {
  const reasons = []
  const eligibility = job.eligibility || {}

  if (!student) {
    return { eligible: false, reasons: ["Student profile not found"] }
  }

  const minimumCgpa = eligibility.minimumCgpa || 0
  if (student.cgpa < minimumCgpa) {
    reasons.push(`CGPA below required minimum of ${minimumCgpa}`)
  }

  const departments = eligibility.eligibleDepartments || []
  if (departments.length > 0) {
    const normalized = departments.map((d) => d.toLowerCase())
    if (!normalized.includes(String(student.department).toLowerCase())) {
      reasons.push("Department not eligible")
    }
  }

  const graduationYears = eligibility.eligibleGraduationYears || []
  if (
    graduationYears.length > 0 &&
    !graduationYears.includes(student.graduationYear)
  ) {
    reasons.push("Graduation year not eligible")
  }

  const requiredSkills = eligibility.requiredSkills || []
  const studentSkills = (student.skills || []).map((s) =>
    String(s).toLowerCase(),
  )
  const missing = requiredSkills.filter(
    (skill) => !studentSkills.includes(String(skill).toLowerCase()),
  )
  if (missing.length > 0) {
    reasons.push(`Missing required skills: ${missing.join(", ")}`)
  }

  if (eligibility.backlogAllowed === false && student.hasActiveBacklogs) {
    reasons.push("Active backlogs are not allowed")
  }

  return { eligible: reasons.length === 0, reasons }
}

module.exports = { checkEligibility }
