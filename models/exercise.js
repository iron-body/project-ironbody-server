const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const exerciseSchema = new Schema(
  {
    
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
      validate: {
        validator: function (value) {
          return !isNaN(value);
        },
        message: "Invalid date format",
      },
    },
    name: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      required: true,
    },
  },
  // {
  //   collection: "exercise",
  //   versionKey: false,
  //   timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  // },
  { versionKey: false, timestamps: true }
);



const userExerciseSchema = new Schema(
  {
    exercise: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // time: {
    //   type: Number,
    //   required: true,
    //   default: 1,
    //   validate: {
    //     validator: function (value) {
    //       return value >= 1;
    //     },
    //     message: "Time must be at least 1",
    //   },
    // },
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
      validate: {
        validator: function (value) {
          return !isNaN(value);
        },
        message: "Invalid date format",
      },
    },
    time: {
      type: Number,
      required: true,
      },
    
    // name: {
    //   type: String,
    //   required: true,
    // },
    // done: {
    //   type: Boolean,
    //   required: true,
    // },
  },
  // {
  //   collection: "exercise",
  //   versionKey: false,
  //   timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  // }
  { versionKey: false, timestamps: true }
);
const Exercise = model("exercise", exerciseSchema)
const UserExercise = model("user_exercise", userExerciseSchema);
userExerciseSchema.post("save", handleMongooseError);

const addExerciseSchema = Joi.object({
  // owner: Joi.object().required(),
  exercise: Joi.string().required(),
  time: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
  date: Joi.date().iso().required(),
  // name: Joi.string().required(),
  // done: Joi.boolean().required(),
});

const updateExerciseSchema = Joi.boolean().required();

const schemas = {
  addExerciseSchema,
  updateExerciseSchema,
};

module.exports = { UserExercise, Exercise, schemas };
