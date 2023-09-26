const { HttpError, ctrlWrapper } = require("../helpers");
const { Exercise, UserExercise } = require("../models/exercise");
const moment = require("moment");


const updateURL = async (req,res)=>{

const updateResult = await Exercise.updateMany(
    { },
    [
      {
        $set: {
          gifUrl: {
            $concat: [
              "https://res.cloudinary.com/dw1ybwpgb/image/upload/v1695659838/exercises/", //ваша частина url
              { $arrayElemAt: [{ $split: ["$gifUrl", "/"] }, -1] }
            ]
          }
        }
      }
    ]
  );
  res.status(201).json(updateResult)
}



const getAllExercises = async (req, res) => {
  const {
    // limit = 25, page = 1,
    date, done
  } = req.query;
  // const startFrom = (+page - 1) * +limit;
  // Get total items
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

const newExercise = await UserExercise.create({ ...req.body, owner }); 
  res.status(201).json(newExercise);
};



const getExercisesByDate = async (req, res) => {
  const { date } = req.query;
  console.log("date", date)
  const { _id: owner } = req.user;
  // Check if exist
  const getExercise = await UserExercise.findOne({
    date,
    owner
  })
    // .select("date");
  if (!getExercise) {
    throw HttpError(404, `The exercise with id "${date}" not found`);
  }
  res.status(200).json(getExercise);
};

const deleteExercise = async (req, res) => {
  const { id, date } = req.body;
  const { _id: owner } = req.user;

  if (!id || !date) {
    throw HttpError(400, "Both 'exercise id' and 'date' must be provided in the request body");
  }

  // Перевіряємо, чи існує вправа з вказаним id, датою та власником
  const getExercise = await UserExercise.findOne({
    exercise: id,
    date,
    owner,
  }).select("id");

  if (!getExercise) {
    throw HttpError(404, `The exercise with id "${id}", date "${date}", and owner "${owner}" not found`);
  }

  // Видаляємо вправу, враховуючи id, дату та власника
  await UserExercise.deleteOne({
    exercise: id,
    date,
    owner,
  });

  res.status(200).json({
    ok: `The exercise with id "${id}", date "${date}", and owner "${owner}" was successfully deleted`,
  });
};





// контролерів немає в тз
const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { done = false } = req.body;
  // Check if exist
  const getExercise = await UserExercise.findOne({
    _id: id,
  }).select("_id");
  if (!getExercise) {
    throw HttpError(404, `The exercise with id "${id}" not found`);
  }
  // Update exercise
  await UserExercise.updateOne(
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

const getUserExercises = async (req, res) => {
  // ? додаємо id юзера
  const { _id: owner } = req.user;

//   const { page = 1, limit = 10, favorite } = req.query;


//   // ? в find 3-й пар - дод налашт - є вбудовані skip та limit
//   const skip = (page - 1) * limit;

  // ? додаю id при отриманні контактів щоб видавалися контакти тільки цієї людини
    const data = await UserExercise.find({ owner }, "-createdAt -updatedAt",
//         {
//     skip,
//     limit,
//     favorite,
//   }).populate("owner", "name email"); // ? додаємо populate щоб отр повну інформацію по полю яке є аргументом/ !другий аргумент, це уточнення, якщо не потр все! // ? дозв підкл фільтрацію
    ).populate("owner");
  res.status(200).json(data);
};
const getExercise = async (req, res) => {
  const { id } = req.params;
  // Check if exist
  const getExercise = await UserExercise.findOne({
    _id: id,
  }).select("_id");
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
  updateURL: ctrlWrapper(updateURL),
  createExercise: ctrlWrapper(createExercise),
  getExercisesByDate: ctrlWrapper(getExercisesByDate),
  updateExercise: ctrlWrapper(updateExercise),
  deleteExercise: ctrlWrapper(deleteExercise),
  getUserExercises: ctrlWrapper(getUserExercises),
  getAllExercises: ctrlWrapper(getAllExercises),
  getExercise: ctrlWrapper(getExercise),
};

