const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const userExerciseSchema = new Schema(
  {
    exercise: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    bodyPart: {
      type: String,
     
    },
    gifUrl: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    time: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validator: function (value) {
          return value >= 1;
        },
        message: "Time must be at least 1",
      },
    },
    calories: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validator: function (value) {
          return value >= 1;
        },
        message: "Calories must be at least 1",
      },
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      // type: Date,
      // required: true,
      // validate: {
      //   validator: function (value) {
      //     return !isNaN(value);
      //   },
      //   message: "Invalid date format",
      // },
    },
    
  },

  { versionKey: false, timestamps: true }
);

const UserExercise = model("user_exercise", userExerciseSchema);
userExerciseSchema.post("save", handleMongooseError);

const addExerciseSchema = Joi.object({
  exercise: Joi.string().required(),
  time: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
  date: Joi.allow().required(),
});

const updateExerciseSchema = Joi.boolean().required();

const schemas = {
  addExerciseSchema,
  updateExerciseSchema,
};

module.exports = { UserExercise, schemas };
