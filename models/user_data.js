const { Schema, model } = require('mongoose');
const { handleMongooseError, HttpError } = require('../helpers');
const Joi = require('joi');
const { format } = require('date-fns');
const moment = require('moment');
// const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
const bloodList = [1, 2, 3, 4];
const sexList = ['male', 'female'];
const levelActivityList = [1, 2, 3, 4, 5];

const formatDate = (value, helpers) => {
  if (!value || !(value instanceof Date)) {
    throw HttpError(400, 'invalid date');
  }

  const formattedDate = `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`;
  return formattedDate;
};

const dataUsersSchema = new Schema(
  {
    // avatarUrl: {
    //   type: String,
    //   required: true,
    // },
    height: {
      type: Number,
      min: 150,
      required: true,
    },
    currentWeight: {
      type: Number,
      min: 35,
      required: true,
    },
    desiredWeight: {
      type: Number,
      min: 35,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const valueDate = moment(value).utc();
          const currentDate = new Date();
          const age = (currentDate - valueDate) / (1000 * 60 * 60 * 24 * 365);
          return age >= 18;
        },
        message: 'You must be at least 18 years old.',
      },
      // validate: {
      //   validator: function (value) {
      //     const formattedDate = format(value, "dd/MM/yyyy");
      //     console.log(`Formatted Date: ${formattedDate}`);
      //     const age = (new Date() - value) / (1000 * 60 * 60 * 24 * 365);
      //     return age >= 18;
      //   },
      //   message: "You must be at least 18 years old.",
      // },
    },
    blood: {
      type: Number,
      enum: bloodList,
      required: true,
    },
    sex: {
      type: String,
      enum: sexList,
      required: true,
    },
    levelActivity: {
      type: Number,
      enum: levelActivityList,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId, // * це означає що тут буде зберіг id, який генерує mongodb
      ref: 'user', // ? ref - це назва колекції з якої це id
      requered: true,
    },
    diary: [
      {
        date: { type: String, required: [true, 'Date is required! This is diary!'] },
        productsDiary: [],
        excersizeDiary: [],
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

dataUsersSchema.post('save', handleMongooseError);
const UserData = model('userData', dataUsersSchema);

const userDataSchema = Joi.object({
  height: Joi.number().min(150).required(),

  currentWeight: Joi.number().min(30).required(),
  desiredWeight: Joi.number().min(30).required(),

  birthday: Joi.date()
    // .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000))
    //   .custom((value, helpers) => {
    //     const formattedDate = formatDate(value, HttpError);
    //     const age = (new Date() - value) / (1000 * 60 * 60 * 24 * 365);
    //     if (age < 18) {
    //       throw HttpError(400, "You must be at least 18 years old.");
    //     }
    //     return formattedDate;
    //   })
    //   .required(),
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)) // Встановлюємо максимальну дату, яка відповідає 18 рокам назад
    .iso()
    .required(),

  // birthday: Joi.string().pattern(dateRegexp).required(),
  blood: Joi.number()
    .valid(...bloodList)
    .required(),
  sex: Joi.string()
    .valid(...sexList)
    .required(),
  levelActivity: Joi.number()
    .valid(...levelActivityList)
    .required(),
  owner: {
    type: Schema.Types.ObjectId, // * це означає що тут буде зберіг id, який генерує mongodb
    ref: 'user', // ? ref - це назва колекції з якої це id
    requered: true,
  },
});
const calculateSchema = Joi.object({
  height: Joi.number().min(150).required(),
  currentWeight: Joi.number().min(35).required(),
  desiredWeight: Joi.number().min(35).required(),
  birthday: Joi.date()
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000))
    .iso()
    .required(),
  blood: Joi.number().valid(1, 2, 3, 4).required(),
  sex: Joi.string().valid('male', 'female').required(),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required(),
});

const schemas = {
  userDataSchema,
  calculateSchema,
};

module.exports = { UserData, schemas };
