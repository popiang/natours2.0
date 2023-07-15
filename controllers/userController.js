const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
    //* 1) check if there are password and confirmPassword in the req.body
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new AppError(
                "This route is not for password update. Please use /updatePassword.",
                400
            )
        );
    }

    //* 2) filter the req.body, only allow name & email fields
    const filteredBody = filterObj(req.body, "name", "email");

    //* 3) find and update the user
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});
