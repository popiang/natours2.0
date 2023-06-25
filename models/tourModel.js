const mongoose = require("mongoose");

// create tour schema
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true,
            trim: true,
			maxlength: [40, 'A tour name mush have less or equal then 40 characters']
        },
        duration: {
            type: Number,
            required: [true, "A tour must have a duration"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a group size"],
        },
        difficulty: {
            type: String,
            required: [true, "A tour must have a difficulty"],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Difficulty has to be easy, medium or difficult'
			}
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
			min: [1, 'Rating must be between 1 to 5'],
			max: [5, 'Rating must be between 1 to 5']
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "A tour must have a price"],
        },
        priceDiscount: {
			type: Number,
			validate: {
				validator: function(val) {
					return val < this.price
				},
				message: 'Discount price ({VALUE}) should be lower the regular price'
			}
		},
        summary: {
            type: String,
            trim: true,
            required: [true, "A tour must have a description"],
        },
        imageCover: {
            type: String,
            required: [true, "A tour must have an image cover"],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
			select: false
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

//* document middleware
// tourSchema.pre('save', function(next) {
// 	console.log('Will save the document..');
// 	next();
// });

// tourSchema.post('save', function(doc, next) {
// 	console.log(doc);
// 	next();
// });

//* query middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
});

//* aggregate middleware
tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

// use the schema to create model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
