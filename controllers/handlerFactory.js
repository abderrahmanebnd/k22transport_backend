const APIFeatures = require("../utils/apiFeatures");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with this ID"));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model, dataName) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with this ID"));
    }
    res.status(200).json({
      status: "success",

      [dataName]: doc,
    });
  });

exports.createOne = (Model, dataName = "data") =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      [dataName]: doc,
    });
  });

exports.getOne = (Model, dataName = "data", popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id).select("-__v");
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with this ID"));
    }

    res.status(200).json({
      status: "success",
      [dataName]: doc,
    });
  });

exports.getAll = (Model, dataName = "data", getFilter = null) =>
  catchAsync(async (req, res, next) => {
    const filter = getFilter ? getFilter(req) : {};
    const features = new APIFeatures(Model.find(filter), req.query);
    await features.setTotalDocs();

    features.filter().sort().limitFields().paginate();

    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      pagination: features.getPaginationDetails(),
      [dataName]: docs,
    });
  });
