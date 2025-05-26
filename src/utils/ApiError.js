class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal Server Error",
    errors = [],
    statck = ""
  ){
    super(message);
    this.data = null;
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;

    if (statck){
        this.stack = statck;    
    } else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError }