const moment = require('moment');
const { HttpError, ctrlWrapper } = require('../helpers');
const { Exercise } = require('../models/exercise');
const { UserExercise } = require('../models/userExercise');

// const updateURL = async (req,res)=>{

// const updateResult = await Exercise.updateMany(
//     { },
//     [
//       {
//         $set: {
//           gifUrl: {
//             $concat: [
//               "https://res.cloudinary.com/dw1ybwpgb/image/upload/v1695659838/exercises/", //ваша частина url
//               { $arrayElemAt: [{ $split: ["$gifUrl", "/"] }, -1] }
//             ]
//           }
//         }
//       }
//     ]
//   );
//   res.status(201).json(updateResult)
// }

const getAllExercises = async (req, res) => {
  const {
    // limit = 25, page = 1,
    date,
  } = req.query;
  const formattedDate = moment.utc(date, 'DD/MM/YYYY');
  // const startFrom = (+page - 1) * +limit;
  // Get total items
  const totalItems = await Exercise.countDocuments({
    ...(date && {
      date: {
        $lte: moment(formattedDate).endOf('day').toDate(),
        $gte: moment(formattedDate).startOf('day').toDate(),
      },
    }),
    ...(typeof done !== 'undefined' && {
      done,
    }),
  });
  const dataList = await Exercise.find({
    ...(date && {
      date: {
        $lte: moment(formattedDate).endOf('day').toDate(),
        $gte: moment(formattedDate).startOf('day').toDate(),
      },
    }),
    // ...(typeof done !== "undefined" && {
    //   done,
    // }),
  });
  if (!dataList) {
    throw HttpError(404, 'Not found!');
  }
  // .limit(+limit)
  // .skip(startFrom);
  res.status(200).json({
    dataList,
    // limit,
    // page,
    // totalItems,
    // totalPages: totalItems ? Math.ceil(+totalItems / +limit) : 0,
  });
};

const createExercise = async (req, res) => {
  const { _id: owner } = req.user;
  const { date, exercise } = req.body;
  const exerciseData = await Exercise.findById(exercise);
  const { name, bodyPart, gifUrl } = exerciseData;

 if (!exerciseData) {
    throw HttpError(404, `The exercise with id "${exercise}" not found`);
  }

  const formattedDate = moment.utc(date, 'DD/MM/YYYY');

  // перевірка на наявність вправи

  const existingExercise = await UserExercise.findOne({ owner, exercise, date: formattedDate });
  if (existingExercise) {
      console.log(existingExercise)
    throw HttpError(400, "This exercise already exist's in this date");
  }

  const newExercise = await UserExercise.create({ ...req.body, name, bodyPart, gifUrl, date: formattedDate, owner });
  res.status(201).json(newExercise);
};

const getExercisesByDate = async (req, res) => {
  const { date } = req.query;
  
  const formattedDate = moment.utc(date, 'DD/MM/YYYY');
  const { _id: owner } = req.user;
  // Check if exist
  const getExercise = await UserExercise.find({
    date: formattedDate,
    _id: owner,
  });

  if (!getExercise) {
    throw HttpError(404, `The exercise with "${date}" not found`);
  }

  const totalItems = await UserExercise.countDocuments({
    owner,
    ...(date && {
      date: {
        $lte: moment(formattedDate).endOf('day').toDate(),
        $gte: moment(formattedDate).startOf('day').toDate(),
      },
    }),
  });

  const dataList = await UserExercise.find({
    owner,
    ...(date && {
      date: {
        $lte: moment(formattedDate).endOf('day').toDate(),
        $gte: moment(formattedDate).startOf('day').toDate(),
      },
    }),
  });
  // .limit(+limit)
  // .skip(startFrom);

  if (!dataList) {
    throw HttpError(404, 'Not found!');
  }
  res.status(200).json({ totalItems, dataList });
};

const deleteExercise = async (req, res) => {
  const { id, date } = req.body;
  const { _id: owner } = req.user;

  if (!id || !date) {
    throw HttpError(400, "Both 'exercise id' and 'date' must be provided in the request body");
  }

  const formattedDate = moment.utc(date, 'DD/MM/YYYY');

  // Перевіряємо, чи існує вправа з вказаним id, датою та власником
  const getExercise = await UserExercise.findOne({
    exercise: id,
    date: formattedDate,
    owner: owner,
  });

  if (!getExercise) {
    throw HttpError(
      404,
      `The exercise with id "${id}", date "${date}", and owner "${owner}" not found`
    );
  }

  // Видаляємо вправу, враховуючи id, дату та власника
  await UserExercise.deleteOne({
    exercise: id,
    date: formattedDate,
    owner: owner,
  });

  res.status(200).json({
    ok: `The exercise with id "${id}", date "${date}", and owner "${owner}" was successfully deleted`,
  });
};

const updateExercise = async (req, res) => {
   const { id } = req.params;
console.log(id)

  // перевірка на наявність вправи

  const existingExercise = await UserExercise.findByIdAndUpdate({ _id: id }, {...req.body});
  if (!existingExercise) {
    throw HttpError(400, "This no such exercise in this date");
  }

  // const updatedExercise = await UserExercise.updateOne({ ...req.body, name, bodyPart, gifUrl, date: formattedDate, owner });
  // res.status(201).json(newExercise);

  res.status(200).json({
    ok: `The exercise with id "${id}" was successfully updated`,
  });
};
// контролерів немає в тз
// const updateExercise = async (req, res) => {
//   const { id } = req.params;
//   const { done = false } = req.body;
//   // Check if exist
//   const getExercise = await UserExercise.findOne({
//     _id: id,
//   }).select('_id');
//   if (!getExercise) {
//     throw HttpError(404, `The exercise with id "${id}" not found`);
//   }
//   // Update exercise
//   await UserExercise.updateOne(
//     {
//       _id: id,
//     },
//     {
//       done,
//     }
//   );
//   res.status(200).json({
//     ok: `The exercise with id "${id}" was successfully updated`,
//   });
// };

const getUserExercises = async (req, res) => {
  // ? додаємо id юзера
  const { _id: owner } = req.user;

  //   const { page = 1, limit = 10, favorite } = req.query;

  //   // ? в find 3-й пар - дод налашт - є вбудовані skip та limit
  //   const skip = (page - 1) * limit;

  // ? додаю id при отриманні контактів щоб видавалися контакти тільки цієї людини
  const data = await UserExercise.find(
    { owner },
    '-createdAt -updatedAt'
    //         {
    //     skip,
    //     limit,
    //     favorite,
    //   }).populate("owner", "name email"); // ? додаємо populate щоб отр повну інформацію по полю яке є аргументом/ !другий аргумент, це уточнення, якщо не потр все! // ? дозв підкл фільтрацію
  ).populate('owner');
  res.status(200).json(data);
};
const getExercise = async (req, res) => {
  const { id } = req.params;
  // Check if exist
  const getExercise = await UserExercise.findOne({
    _id: id,
  }).select('_id');
  if (!getExercise) {
    throw HttpError(404, `The exercise with id "${id}" not found`);
  }
  res.status(200).json(getExercise);
};

// ? перероблені роути
// const deleteExercise = async (req, res) => {
//   const { id } = req.params;
//   // Check if exist
//   const getExercise = await UserExercise.findOne({
//     _id: id,
//   }).select("_id");
//   if (!getExercise) {
//     throw HttpError(404, `The exercise with id "${id}" not found`);
//   }
//   // Delete Exercise
//   await UserExercise.deleteOne({
//     _id: id,
//   });
//   res.status(200).json({
//     ok: `The exercise with id "${id}" was successfully deleted`,
//   });
// };
// const createExercise = async (req, res) => {
//   const newExercise = new Exercise({
//     ...req.body,
//     owner: req.user._id,
//   });
//   const { _id } = await newExercise.save();
//   res.status(200).json({
//     ...req.body,
//     id: _id,
//   });
// };

//
module.exports = {
  // updateURL: ctrlWrapper(updateURL),
  createExercise: ctrlWrapper(createExercise),
  getExercisesByDate: ctrlWrapper(getExercisesByDate),
  updateExercise: ctrlWrapper(updateExercise),
  deleteExercise: ctrlWrapper(deleteExercise),
  getUserExercises: ctrlWrapper(getUserExercises),
  getAllExercises: ctrlWrapper(getAllExercises),
  getExercise: ctrlWrapper(getExercise),
};
