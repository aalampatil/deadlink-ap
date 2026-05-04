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

  static unauthorised(message: string = "unauthorised"): ApiError {
    return new ApiError(401, message);
  }
  static forbidden(message: string = "unauthorised"): ApiError {
    return new ApiError(403, message);
  }

  static notfound(message: string = "not found"): ApiError {
    return new ApiError(404, message);
  }

  static gone(message: string = "resource expired"): ApiError {
    return new ApiError(410, message);
  }

  static internalError(message: string = "server error"): ApiError {
    return new ApiError(500, message);
  }
}

export default ApiError;
