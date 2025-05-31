class ApiResponse {
    constructor(statusCode, message, data = "Success"){
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

export { ApiResponse };