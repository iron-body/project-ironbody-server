const { HttpError, ctrlWrapper } = require("../helpers");
const { Exercise } = require("../models/exercise");
const moment = require("moment");
const createExercise = async (req, res) => {
  const newExercise = new Exercise({
    ...req.body,
    owner: req.user._id,
  });
  const { _id } = await newExercise.save();
  res.status(200).json({
    ...req.body,
    id: _id,
  });
};
const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { done = false } = req.body;
  const getExercise = await Exercise.findOne({
    _id: id,
  }).select("_id");
  if (!getExercise) {
    throw HttpError(404, `The exercise with id "${id}" not found`);
  }
  await Exercise.updateOne(
    {
      _id: id,
    },
    {
      done,
    }
  );
  res.status(200).json({
    ok: `The exercise with id "${id}" was successfully updated`,
  });
};
const getExercise = async (req, res) => {
  const { id } = req.params;
  // Check if exist
  const getExercise = await Exercise.findOne({
    _id: id,
  }).select("_id");
  if (!getExercise) {
    throw HttpError(404, `The exercise with id "${id}" not found`);
  }
  res.status(200).json(getExercise);
};
const deleteExercise = async (req, res) => {
  const { id } = req.params;
  const getExercise = await Exercise.findOne({
    _id: id,
  }).select("_id");
  if (!getExercise) {
    throw HttpError(404, `The exercise with id "${id}" not found`);
  }
  await Exercise.deleteOne({
    _id: id,
  });
  res.status(200).json({
    ok: `The exercise with id "${id}" was successfully deleted`,
  });
};

const getAllExercises = async (req, res) => {
  const { limit = 25, page = 1, date, done } = req.query;
  const startFrom = (+page - 1) * +limit;
  const totalItems = await Exercise.countDocuments({
    ...(date && {
      date: {
        $lte: moment(date, "DD.MM.YYYY").endOf("day").toDate(),
        $gte: moment(date, "DD.MM.YYYY").startOf("day").toDate(),
      },
    }),
    ...(typeof done !== "undefined" && {
      done,
    }),
  });
  const dataList = await Exercise.find({
    ...(date && {
      date: {
        $lte: moment(date, "DD.MM.YYYY").endOf("day").toDate(),
        $gte: moment(date, "DD.MM.YYYY").startOf("day").toDate(),
      },
    }),
    ...(typeof done !== "undefined" && {
      done,
    }),
  })
    .limit(+limit)
    .skip(startFrom);
  res.status(200).json({
    dataList,
    limit,
    page,
    totalItems,
    totalPages: totalItems ? Math.ceil(+totalItems / +limit) : 0,
  });
};
module.exports = {
  createExercise: ctrlWrapper(createExercise),
  updateExercise: ctrlWrapper(updateExercise),
  deleteExercise: ctrlWrapper(deleteExercise),
  getAllExercises: ctrlWrapper(getAllExercises),
  getExercise: ctrlWrapper(getExercise),
};
