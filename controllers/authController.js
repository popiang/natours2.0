const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });

    const token = signToken(newUser._id);

    res.status(200).json({
        status: "success",
		test: "hello",
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    // 1) get the email and password from user
    // const email = req.body.email;
    // const password = req.body.password;
    const { email, password } = req.body;

    // 2) check if email and password are sent
    if (!email || !password) {
        return next(new AppError("Missing email or password!!", 400));
    }

    // 3) check if user with the email is exist
    const user = await User.findOne({ email: email }).select("+password");

    // 4) check if password is the same with the one in db
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password!!", 401));
    }

    // 5) if everything is ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token,
    });
});
