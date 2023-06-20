const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

/* middleware */

// http request logger middleware for node.js
app.use(morgan("dev"));

// to modify the incoming req data and add into req object
app.use(bodyParser.json());

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

module.exports = app;
