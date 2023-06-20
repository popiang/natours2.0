const fs = require("fs");

// get all the tours from file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-sample.json`)
);

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours,
        },
    });
};

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.editTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
