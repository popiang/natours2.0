const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router
    .route("/top5cheap")
    .get(tourController.top5Cheaps, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router
    .route("/monthly-plan/:year")
    .get(
        authController.protect,
        authController.restrictTo("admin", "lead-guide", "guide"),
        tourController.getMonthlyPlan
    );

router
    .route("/")
    .get(tourController.getAllTours)
    .post(
        tourController.checkBody,
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.createTour
    );
router
    .route("/:id")
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.editTour
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour
    );

module.exports = router;
