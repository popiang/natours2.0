const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/handlerFactory");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res) => {
//     const users = await User.find();

//     res.status(200).json({
//         status: "success",
//         data: {
//             results: users.length,
//             users: users,
//         },
//     });
// });

exports.getAllUsers = factory.getAll(User);

// exports.getUser = catchAsync(async (req, res) => {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//         return next(new AppError("User with this ID is not exist!", 400));
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             user: user,
//         },
//     });
// });

exports.getUser = factory.getOne(User);

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

exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
