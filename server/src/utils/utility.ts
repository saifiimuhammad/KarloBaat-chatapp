class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Required when extending built-in classes
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export { ErrorHandler };
