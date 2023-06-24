const express = require("express");

const tourController = require("../controllers/tourController");
const router = express.Router();

// router.param("id", tourController.checkID);

router
    .route("/top5cheap")
    .get(tourController.top5Cheaps, tourController.getAllTours);

router
	.route("/stats")
	.get(tourController.getTourStats);

router
    .route("/")
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour);
router
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.editTour)
    .delete(tourController.deleteTour);

module.exports = router;
