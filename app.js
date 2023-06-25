const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

/* middleware */

// http request logger middleware for node.js
if (process.env.NODE_ENV === 'development') {
	app.use(morgan("dev"));
}

// to modify the incoming req data and add into req object
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/public`));

// custom middleware
app.use((req, res, next) => {
    console.log("Hello from the middleware!!");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
	res.status(400).json({
		status: "fail",
		message: `Can't find ${req.originalUrl} on this server`
	});
});

app.use((err, req, res, next) => {
	err.status = err.status || 'error';
	err.statusCode = err.statusCode || 500;

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message
	});
});

module.exports = app;
