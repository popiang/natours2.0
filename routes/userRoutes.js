const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router
    .route("/")
    .get(userController.getAllUsers)
    .post(authController.signup);
router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.editUser)
    .delete(userController.deleteUser);

module.exports = router;
