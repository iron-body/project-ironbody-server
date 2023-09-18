const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/;
// const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
const bloodList = [1, 2, 3, 4];
const sexList = ["male", "female"];
const levelActivityList = [1, 2, 3, 4, 5];

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
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const age = (new Date() - value) / (1000 * 60 * 60 * 24 * 365);
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
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);
const User_data = model("user_data", dataUsersSchema);


const userDataSchema = Joi.object({
  height: Joi.number().min(150).required(),
  
    currentWeight: Joi.number().min(30).required(),
    desiredWeight: Joi.number().min(30).required(),

   birthday: Joi.date()
    .max(new Date(Date.now() - (18 * 365 * 24 * 60 * 60 * 1000))) // Встановлюємо максимальну дату, яка відповідає 18 рокам назад
    .iso()
    .required(),

  // birthday: Joi.string().pattern(dateRegexp).required(),
    blood: Joi.number().valid(...bloodList).required(),
    sex: Joi.string().valid(...sexList).required(),
    levelActivity: Joi.number().valid(...levelActivityList).required(),
  
})
const schemas = {

  userDataSchema,
};

module.exports = { User_data, schemas };