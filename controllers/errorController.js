const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 404);
}

const handleDuplicateFieldsDB = err => {
	const value = Object.values(err.keyValue)[0];
	const message = `Duplicate field: ${value}. Please use another value!`;
	return new AppError(message, 404);
}

const handleValidationErrorDB = err => {
	const errorMessages = Object.values(err.errors).map(el => el.message);
	const message = `Invalid input data. ${errorMessages.join(', ')}`;
	return new AppError(messsage, 400);
}

const handleJWTError = err => {
	return new AppError("Invalid token. Please login again!!", 401);
}

const handleTokenExpiredError = err => {
	return new AppError("Token expired. Please login again!!", 401);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {

    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.log("Error!!", err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {

        let error = { ...err };
		error.name = err.name;

		if (error.name === "CastError") {
			error = handleCastErrorDB(error);
		}

		if (error.name === 'ValidationError') {
			error = handleValidationErrorDB(error);
		} 

		if (error.code = 11000) {
			error = handleDuplicateFieldsDB(error);
		}

		if (error.name === "JsonWebTokenError") {
			error = handleJWTError(error);
		}
		
		if (error.name === "TokenExpiredError") {
			error = handleTokenExpiredError(error);
		}

		sendErrorProd(error, res);
    }
};
