const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');


const exerciseSchema = new Schema(
    {
// {

//     "equipment": "body weight",
//     "gifUrl": "https://res.cloudinary.com/ditdqzoio/image/upload/v1687127066/exercises/0001.gif",
//     "name": "3/4 sit-up",
//     "target": "abs",
//     "burnedCalories": 220,
//     "time": 3
//   },
name: {
      type: String,
      required: [true, 'Set name of exercise'],
        },
    bodypart: {
      type: String,
      required: [true, 'Set bodypart'],
        },
        equipment:{
      type: String,
      required: [true, 'Set category of equipment'],
        },
        target: {
            type: String
        },

        burnedCalories: {
            type: Number,
      required: [true, 'Set amount of burnedCalories'],
        },
        "time": {
            type: Number,
      required: [true, 'Set time in min'],
        },

        // ???
   
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const Exercise = model('exercise', exerciseSchema);
exerciseSchema.post('save', handleMongooseError);

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
  addSchema,
//   updateFavoriteSchema,
};
module.exports = { Exercise, schemas };
