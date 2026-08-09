const MAX_LIMIT = 50

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), MAX_LIMIT)
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: total === 0 ? 0 : Math.ceil(total / limit),
})

module.exports = { parsePagination, buildPagination, MAX_LIMIT }
