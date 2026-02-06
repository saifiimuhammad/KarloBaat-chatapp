const errorMiddleware = (err, _req, res, _next) => {
    err.message || (err.message = "Internal Server Error");
    err.statusCode || (err.statusCode = 500);
    // Mongo duplicate key error
    if (err.code === 11000 && err.keyPattern) {
        const error = Object.keys(err.keyPattern).join(",");
        err.message = `Duplicate field value entered for ${error}`;
        err.statusCode = 400;
    }
    // Mongoose cast error
    if (err.name === "CastError" && err.path) {
        err.message = `Invalid format of ${err.path}`;
        err.statusCode = 400;
    }
    return res.status(err.statusCode).json({
        success: false,
        // message: envMode === "DEVELOPMENT" ? err : err.message,
        message: err.message,
    });
};
const TryCatch = (passedFunc) => async (req, res, next) => {
    try {
        await passedFunc(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
export { errorMiddleware, TryCatch };
//# sourceMappingURL=error.js.map