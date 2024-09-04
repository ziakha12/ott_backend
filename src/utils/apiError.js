class apiError extends Error {
  constructor(
    statuscode,
    message = "something Went Wrong Api Error",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statuscode = statuscode;
    this.message = message,
    this.success = false,
    this.errors = errors,
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { apiError };
