const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const userProductsSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: { type: String, required: [true, 'You forget to add category'] },
    // amount: {
    //   type: Number,
    //   required: true,
    //   default: 1,
    //   validate: {
    //     validator: function (value) {
    //       return value >= 1;
    //     },
    //     message: 'Amount must be greater than or equal to 1',
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
        message: 'Calories must be greater than or equal to 1',
      },
    },
    weight: {
      type: Number,
      required: [true, 'Enter weight'],
      default: 100,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    done: {
      type: Boolean,
      required: true,
      default: false,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'userProduct',
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

userProductsSchema.post('save', handleMongooseError);
const UserProduct = model('userProduct', userProductsSchema);

const addUserProductsSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  calories: Joi.number().min(1).required(),
  weight: Joi.number().min(100).required(),
  date: Joi.date().required(),
  // done: Joi.boolean().required(),
  _id: Joi.allow(),
  recommended: Joi.boolean(),
});

const updateUserProductsSchema = Joi.object({
  done: Joi.boolean().required(),
});

const userProductsSchemas = {
  addUserProductsSchema,
  updateUserProductsSchema,
};
module.exports = { UserProduct, userProductsSchemas };
