class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = "bad request"): ApiError {
    return new ApiError(400, message);
  }
  static notfound(message: string = "not found"): ApiError {
    return new ApiError(412, message);
  }

  static internalError(message: string = "server error"): ApiError {
    return new ApiError(404, message);
  }
}

export default ApiError;
