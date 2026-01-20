class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export { ErrorHandler };
//# sourceMappingURL=utility.js.map