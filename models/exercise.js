const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const exerciseSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    time: {
      type: Number,
      required: true,
      default: 1,
      // validate: {
      //   validate(value) {
      //     return value >= 1;
      //   },
      // },
    },
    calories: {
      type: Number,
      required: true,
      default: 1,
      // validate: {
      //   validate(value) {
      //     return value >= 1;
      //   },
      // },
    },
    date: {
      type: Date,
      required: true,
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
    collection: 'exercise',
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

const Exercise = model('Exercise', exerciseSchema);
exerciseSchema.post('save', handleMongooseError);

const addExerciseSchema = Joi.object({
  owner: Joi.string().required(),
  time: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
  date: Joi.string()
    .regex(/^(\d{2})-(\d{2})-(\d{4})$/)
    .required(),
  name: Joi.string().required(),
  done: Joi.boolean().required(),
});

const updateExerciseSchema = Joi.object({
  done: Joi.boolean().required(),
});

// const addSchema = Joi.object({
//   name: Joi.string().min(2).required(),
//   email: Joi.string().email().required(),
//   phone: Joi.string().pattern(phoneRegex).required(),
//   favorite: Joi.boolean(),
// });
// const updateFavoriteSchema = Joi.object({
//   favorite: Joi.boolean().required(),
// });

const schemas = {
  addExerciseSchema,
  updateExerciseSchema,
};
module.exports = { Exercise, schemas };
