const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");

const express = require("express");

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

// get all the tours from file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-sample.json`)
);


/* routes handlers */

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours,
        },
    });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    if (!tour) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid ID",
        });
    }

    res.status(200).json({
        statis: "success",
        data: {
            tour: tour,
        },
    });
};

const createTour = (req, res) => {
    console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    console.log(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-sample.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(200).json({
                status: "success",
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

const editTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    if (!tour) {
        res.status(400).json({
            status: "fail",
            message: "Invalid ID",
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: "<updated tour here>",
        },
    });
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    if (!tour) {
        res.status(400).json({
            status: "fail",
            message: "Invalid ID",
        });
    }

    res.status(200).json({
        status: "success",
    });
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });
};

const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });
};

const editUser = (req, res) => {
	res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });	
}

const deleteUser = (req, res) => {
	res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });	
}

/* routes */

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(editTour).delete(deleteTour);

app.route("/").get(getAllUsers).post(createUser);
app.route("/:id").get(getUser).patch(editUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


/* start the server */

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
