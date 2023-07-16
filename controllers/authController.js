const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
    }

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: user,
        },
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

    //* 6) grant access to protected route
    req.user = currentUser;
    next();
});

//* to protect route by checking user roles to perfom certain action
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403
                )
            );
        }
        next();
    };
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });

	createSendToken(newUser, 201, res);

    // const token = signToken(newUser._id);

    // res.status(200).json({
    //     status: "success",
    //     test: "hello",
    //     token,
    //     data: {
    //         user: newUser,
    //     },
    // });
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
	createSendToken(user, 200, res);

    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: "success",
    //     token,
    // });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //* 1) get user email from request body
    const user = await User.findOne({ email: req.body.email });

    console.log(user);

    //* 2) validate if user exist
    if (!user) {
        return next(
            new AppError("There is no user with the email address!", 404)
        );
    }

    //* 3) get reset token
    const resetToken = user.createPasswordResetToken();

    //* 4) save encrypted reset password token in db
    await user.save({ validateBeforeSave: false });

    //* 5) prepare the reset URL
    const resetURL = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    //* 6) prepare the message
    const message = `Forgot your password? Submit a PATCH request witt your new password and confirm password to: ${resetURL}. If you didn't forget your password, please ignore this email!`;

    //* 7) send the email to user
    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (Valid for 10 minutes)",
            message: message,
        });

        res.status(200).json({
            status: "success",
            message: "Token sent to email",
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                "There was an error sending the email. Please try again later!",
                500
            )
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //* 1) get token from parameter
    const resetToken = req.params.token;

    //* 2) encrypt the token
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //* 3) find user using the encrypted token
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    //* 4) throw error if no user's found
    if (!user) {
        return next(new AppError("Token is invalid or has expired!!", 400));
    }

    //* 5) update user's data
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //* log the user in, send JWT
	createSendToken(user, 200, res);
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: "success",
    //     token,
    // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //* 1) find the logged in user
    const user = await User.findById(req.user._id);

    //* 2) validate the user
    if (!user) {
        return next(new AppError("User is not exist in the system!", 400));
    }

    //* 3) update the user info with the new password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangeAt = Date.now();
    await user.save();

    //* 4) log user in, send JWT token
	createSendToken(user, 200, res);
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: "success",
    //     token,
    // });
});
