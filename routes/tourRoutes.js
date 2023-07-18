const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

// router.param("id", tourController.checkID);

router
    .route("/top5cheap")
    .get(tourController.top5Cheaps, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
    .route("/")
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour);
router
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.editTour)
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour
    );

router
    .route("/:tourId/reviews")
    .post(
        authController.protect,
        authController.restrictTo("user"),
        reviewController.createReview
    );

module.exports = router;
