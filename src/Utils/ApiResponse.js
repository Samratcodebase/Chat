class ApiResponse {
  constructor(success, message, statusCode = 200, data = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}

export default ApiResponse;
