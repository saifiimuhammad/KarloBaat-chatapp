class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Required when extending built-in classes
        Object.setPrototypeOf(this, ErrorHandler.prototype);
    }
}
export { ErrorHandler };
//# sourceMappingURL=utility.js.map