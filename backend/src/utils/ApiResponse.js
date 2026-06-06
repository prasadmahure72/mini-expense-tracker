class ApiResponse {
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.statusCode = statusCode
    this.success = statusCode < 400
    this.message = message
    this.data = data
    if (meta) this.meta = meta
  }

  static success(res, data, message = 'Success', statusCode = 200, meta = null) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message, meta))
  }

  static created(res, data, message = 'Created successfully') {
    return ApiResponse.success(res, data, message, 201)
  }

  static paginated(res, data, total, page, limit, message = 'Success') {
    const totalPages = Math.ceil(total / limit)
    return ApiResponse.success(res, data, message, 200, {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    })
  }
}

module.exports = ApiResponse
