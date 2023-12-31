const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError("Document with the ID is not found", 404));
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
		console.log("masuk update one");
		console.log(req.params.id);
		console.log(req.body);
		console.log(Model);
        const updatedDoc = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
		console.log("updatedDoc: " + updatedDoc);
        if (!updatedDoc) {
            return next(new AppError("Document with the ID is not found", 404));
        }
		console.log("hello!!");

        res.status(200).json({
            status: "success",
            data: {
                docu: updatedDoc,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(200).json({
            status: "success",
            data: {
                doc: doc,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);

        if (popOptions) {
            query = query.populate(popOptions);
        }

        const doc = await query;

        if (!doc) {
            return next(new AppError("Document with the ID is not found", 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                doc: doc,
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        if (req.params.tourId) {
            filter = { tour: req.params.tourId };
        }

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        //* execute query
        const docs = await features.query;

        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            data: {
                docs: docs,
            },
        });
    });
