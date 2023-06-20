const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

// custom middleware
app.use((req, res, next) => {
	console.log("Hello from the middleware!!");
	next();
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
})

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-sample.json`)
);

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

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app.route("/api/v1/tours/:id").get(getTour).patch(editTour).delete(deleteTour);

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
