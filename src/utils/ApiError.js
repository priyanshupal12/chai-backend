class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal Server Error",
    errors = [],
    stack = ""
  ){
    super(message);
    this.data = null;
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;

    if (stack){
        this.stack = stack;    
    } else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError }