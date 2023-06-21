// const fs = require("fs");
const Tour = require("../models/tourModel");

// get all the tours from file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-sample.json`)
// );

// exports.checkID = (req, res, next, val) => {
// 	console.log(`Tour id to check: ${val}`);

// 	// convert id to integer
// 	const id = val * 1;

// 	// get the tour from array
// 	const tour = tours.find(el => el.id === id);

// 	if (!tour) {
// 		return res.status(400).json({
// 			status: "fail",
// 			message: "Invalid ID"
// 		});
// 	}

// 	next();
// }

exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: "fail",
			message: "Tour name and price are compulsory"
		});
	}

	next();
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
		requestedAt: req.requestTime
        // results: tours.length,
        // data: {
        //     tours: tours,
        // },
    });
};

exports.getTour = (req, res) => {
	// convert id to integer
    // const id = req.params.id * 1;

	// get the tour from array
    // const tour = tours.find((el) => el.id === id);

    res.status(200).json({
        statis: "success",
        // data: {
        //     tour: tour,
        // },
    });
};

exports.createTour = async (req, res) => {

	try {
		const newTour = await Tour.create(req.body);
		
		res.status(201).json({
			status: "success",
			data: {
				tour: newTour
			}
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: error
		});
	}
};

exports.editTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            tour: "<updated tour here>",
        },
    });
};

exports.deleteTour = (req, res) => {
    res.status(200).json({
        status: "success",
    });
};
