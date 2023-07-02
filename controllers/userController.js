const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        data: {
			results: users.length,
            users: users,
        },
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });
};

exports.editUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This path is not defined yet",
    });
};
