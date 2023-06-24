
const Tour = require("../models/tourModel");
exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: "fail",
			message: "Tour name and price are compulsory"
		});
	}

	next();
}

exports.getAllTours = async (req, res) => {
	try {
		const queryObj = {...req.query};

		//* filtering
		const excludeFields = ['page', 'sort', 'limit', 'fields'];
		excludeFields.forEach(el => delete queryObj[el]);

		//* advance filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gt|gte|lt|lte)\b/g, 
			match => `$${match}`
		);

		let query = Tour.find(JSON.parse(queryStr));
		
		//* sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }
		console.log(query);
		
		//* execute query
		const tours = await query;

		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			data: {
				tours: tours
			}
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error
		})
	}
};

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);

		res.status(200).json({
			status: "success",
			data: {
				tour: tour
			}
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: error
		});
	}
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

exports.editTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});

		res.status(200).json({
			status: "success",
			data: {
				tour: tour
			}
		})
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: error
		})
	}
};

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: "success",
			data: null
		})
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: error
		});
	}
};
