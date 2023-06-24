const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "fail",
            message: "Tour name and price are compulsory",
        });
    }

    next();
};

exports.top5Cheaps = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summry,difficulty";

    next();
};

exports.getAllTours = async (req, res) => {
    try {
        // const queryObj = { ...req.query };

        // //* filtering
        // const excludeFields = ["page", "sort", "limit", "fields"];
        // excludeFields.forEach((el) => delete queryObj[el]);

        // //* advance filtering
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(
        //     /\b(gt|gte|lt|lte)\b/g,
        //     (match) => `$${match}`
        // );

        // let query = Tour.find(JSON.parse(queryStr));

        // //* sorting
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(",").join(" ");
        //     query = query.sort(sortBy);
        // } else {
        //     query = query.sort("-createdAt");
        // }

        // //* limit fields
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(",").join(" ");
        //     console.log(fields);
        //     query = query.select(fields);
        // } else {
        //     query = query.select("-__v");
        // }

        // if (req.query.limit) {
        //     query = query.limit(req.query.limit);
        // }

        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        //* execute query
        const tours = await features.query;

        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            data: {
                tours: tours,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                tour: tour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

exports.editTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "success",
            data: {
                tour: tour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: "$difficulty" },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
        ]);

        res.status(200).json({
            status: "success",
            data: {
                stats,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

// exports.getMonthlyPlan = async (req, res) => {
//     try {
//         const year = req.params.year * 1;

//         const plan = await Tour.aggregate([
//             {
//                 $unwind: "$startDates",
//             },
//             {
//                 $match: {
//                     startDates: {
//                         $gte: new Date(`${year}-01-01`),
//                         $lte: new Date(`${year}-12-31`),
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: { $month: "$startDates" },
//                     numTourStarts: { $sum: 1 },
//                     tours: { $push: "$name" },
//                 },
//             },
// 			{
// 				$addFields: { month: '$_id'}
// 			},
// 			{
// 				$project: {
// 					_id: 0
// 				}
// 			},
// 			{
// 				$sort: {numTourStarts: -1}
// 			},
// 			{
// 				$limit: 12
// 			}
//         ]);

// 		res.status(200).json({
// 			status: 'success',
// 			data: {
// 				plan
// 			}
// 		})
//     } catch (error) {
//         res.status(400).json({
//             status: "fail",
//             message: error,
//         });
//     }
// };

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: "$startDates",
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: "$name" },
                },
            },
            {
                $addFields: { month: "$_id" },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: { numTourStarts: -1 },
            },
            {
                $limit: 12,
            },
        ]);

        res.status(200).json({
            status: "success",
            data: {
                plan,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};