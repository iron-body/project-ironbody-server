const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const exerciseSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
  {
    collection: "exercise",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Exercise = model("Exercise", exerciseSchema);
exerciseSchema.post("save", handleMongooseError);

const addExerciseSchema = Joi.object({
  time: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
  date: Joi.date().iso().required(),
  name: Joi.string().required(),
  done: Joi.boolean().required(),
});

const updateExerciseSchema = Joi.boolean().required();

const schemas = {
  addExerciseSchema,
  updateExerciseSchema,
};

module.exports = { Exercise, schemas };
