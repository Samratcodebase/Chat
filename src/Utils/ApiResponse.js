class ApiResponse {
  constructor(statusCode = 200, message, data = null) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}

export default ApiResponse;
