const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//* must be logged in to use all review routes
router.use(authController.protect);

router
    .route("/")
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo("user", "admin"),
        reviewController.setTourUserIds,
        reviewController.createReview
    );
router
    .route("/:id")
	.get(reviewController.getReview)
    .patch(
        authController.restrictTo("user", "admin"),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo("user", "admin"),
        reviewController.deleteReview
    );

module.exports = router;
