const asyncHandler = require("../utils/asyncHandler")
const { getPublicStats } = require("../services/admin.service")

// @desc    Public platform statistics (landing page)
// @route   GET /api/stats
// @access  Public
const getStats = asyncHandler(async (req, res) => {
  const stats = await getPublicStats()
  res.json({ success: true, data: stats })
})

module.exports = { getStats }
