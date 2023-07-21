const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes")

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

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

module.exports = router;
