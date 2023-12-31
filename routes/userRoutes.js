const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//* must be logged in for all below routes
router.use(authController.protect);

router.patch("/updatePassword", authController.updatePassword);
router.patch("/updateMe", userController.updateMe);
router.patch("/deleteMe", userController.deleteMe);
router.get("/me", userController.getMe, userController.getUser);

//* only admin allowed for below routes
// router.use(authController.restrictTo("admin"));

// router.route("/").get(userController.getAllUsers);
//     .post(userController.createUser);

router
    .route("/")
    .get(userController.getAllUsers);
    // .post(userController.createUser);

router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
