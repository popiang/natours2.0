const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const app = express();

/* middleware */

// http request logger middleware for node.js
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// rate limiting
const limiter = rateLimit({
    max: 100,
    windowsMs: 60 * 60 * 1000,
    message: "Too many requests from this IP. Please try again in an hour!",
});

app.use("/api", limiter);

// helmet
app.use(helmet());

// data sanitization againts NoSQL query injection
app.use(mongoSanitize());

// data sanitization againts XSS
app.use(xss());

// prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            "duration",
            "ratingsQuantity",
            "ratingsAverage",
            "maxGroupSize",
            "difficulty",
            "price",
        ],
    })
);

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
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
