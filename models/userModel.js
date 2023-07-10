const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"],
        trim: true,
        minlength: [3, "A name must have at least 3 characters"],
        maxlength: [40, "A name must have at least 40 characters"],
    },
    email: {
        type: String,
        required: [true, "A user must have an email address"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    role: {
        type: String,
        enum: ["admin", "guide-lead", "guide", "user"],
        default: "user",
    },
    photo: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "A password is compulsory"],
        trim: true,
        minlength: [8, "Password length must be at least 8 characters"],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "A confirm password is compulsory"],
        trim: true,
        minlength: [8, "Password length must be at least 8 characters"],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: `Passwords don't match`,
        },
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

//* document middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    } else {
        return false;
    }
};

userSchema.methods.createPasswordResetToken = function () {
	//* 1) create token
    const resetToken = crypto.randomBytes(32).toString("hex");

	//* 2) encrypt token and save in table field
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

	console.log(resetToken, this.passwordResetToken);

	//* 3) create 10 minutes token expiry time and save in table field
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
