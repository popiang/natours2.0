const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    photo: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "A password is compulsory"],
        trim: true,
        minlength: [8, "Password length must be at least 8 characters"],
		select: false
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
});

//* document middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
