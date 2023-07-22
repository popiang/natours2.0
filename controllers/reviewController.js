const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/handlerFactory");

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if (req.params.tourId) {
//         filter = { tour: req.params.tourId };
//     }

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: "success",
//         results: reviews.length,
//         data: {
//             reviews: reviews,
//         },
//     });
// });

exports.getAllReviews = factory.getAll(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//     if (!req.body.tour) req.body.tour = req.params.tourId;
//     if (!req.body.user) req.body.user = req.user.id;

//     console.log("tour id: " + req.params.tourId);

//     const newReview = await Review.create(req.body);

//     res.status(200).json({
//         status: "success",
//         data: {
//             review: newReview,
//         },
//     });
// });

exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);