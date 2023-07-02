const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

//* to protect route by checking token and user
exports.protect = catchAsync(async (req, res, next) => {
    //* 1) get the token
    let token = "";
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    //* 2) check if the token exists
    if (!token) {
        return next(
            new AppError(
                "You are not logged in. Please login to get access.",
                401
            )
        );
    }

    //* 3) verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //* 4) check if the user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError("User with the ID is not exist!", 404));
    }

    //* 5) check if user changed password after the token is issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                "User changed password recently. Please login again",
                401
            )
        );
    }

    //* 5) grant access to protected route
    req.user = currentUser;
    next();
});

//* to protect route by checking user roles to perfom certain action
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			new AppError("You do not have permission to perform this action", 403);
		}
		next();
	}
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
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
