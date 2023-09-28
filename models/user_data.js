const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
const bloodList = [1, 2, 3, 4];
const sexList = ["male", "female"];
const levelActivityList = [1, 2, 3, 4, 5];

const dataUsersSchema = new Schema(
  {
    avatarUrl: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      // required: [true, "Name is required"],
    },
    email: {
      type: String,
      // match: emailRegex,
      // unique: true,
      // required: true,
    },
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
          const birthDate = new Date(value);
          const currentDate = new Date();
          const ageMilliseconds = currentDate - birthDate;
          const age = ageMilliseconds / (365 * 24 * 60 * 60 * 1000);
          return age >= 18;
        },
        message: "You must be at least 18 years old.",
      },
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
    calorieNorm: {
      type: Number,
      // required: true,
    },
    sportTimeNorm: {
      type: Number,
      // required: true,
    },
    owner: {
      type: Schema.Types.ObjectId, // * це означає що тут буде зберіг id, який генерує mongodb
      ref: "user", // ref - це назва колекції з якої це id
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

dataUsersSchema.post("save", handleMongooseError);

const userDataSchema = Joi.object({
  height: Joi.number().min(150).required(),
  currentWeight: Joi.number().min(35).required(),
  desiredWeight: Joi.number().min(35).required(),
  birthday: Joi.date()
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)) // Встановлюємо максимальну дату, яка відповідає 18 рокам назад
    .iso()
    .required()
    .messages({
      "date.base":
        "Дата має бути у форматі ISO (наприклад, '2004-09-30T07:37:36.174Z')",
      "date.max": "Вам повинно бути не менше 18 років для реєстрації",
      "any.required": "Дата народження обов'язкова для заповнення",
    }),
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
    ref: "user", // ? ref - це назва колекції з якої це id
    required: true,
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
  blood: Joi.number()
    .valid(...bloodList)
    .required(),
  sex: Joi.string()
    .valid(...sexList)
    .required(),
  levelActivity: Joi.number()
    .valid(...levelActivityList)
    .required(),
});
// оновлення даних користувача
const updateParamsUserSchema = Joi.object({
  height: Joi.number().min(150),
  currentWeight: Joi.number().min(35),
  desiredWeight: Joi.number().min(35),
  birthday: Joi.date()
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000))
    .iso(),
  blood: Joi.number().valid(...bloodList),
  sex: Joi.string().valid(...sexList),
  levelActivity: Joi.number().valid(...levelActivityList),
});

const UserData = model("userData", dataUsersSchema);

const userDataSchemas = {
  userDataSchema,
  calculateSchema,
  updateParamsUserSchema,
};

module.exports = { UserData, userDataSchemas };
