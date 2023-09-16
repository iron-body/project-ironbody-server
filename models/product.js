const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const productsCategoryList = ["alcoholic drinks",
    "berries",
    "cereals",
    "dairy",
    "dried fruits",
    "eggs",
    "fish",
    "flour",
    "fruits",
    "meat",
    "mushrooms",
    "nuts",
    "oils and fats",
    "poppy",
    "sausage",
    "seeds",
    "sesame",
    "soft drinks",
    "vegetables and herbs"]

const productSchema = new Schema(
    {
    title: {
      type: String,
    required: [true, 'Set title of product'],
        },
    category:{
            type: String,
            enum: productsCategoryList,
    required: [true, 'Set category of product'],
        },
        calories: {
            type: Number,
    required: [true, 'Set amount of calories'],
        },
        weight: {
            type: Number,
    required: [true, 'Set weight'],
        },
    groupBloodNotAllowed: {
            "1": {
            type: Boolean,
            required: true
            },
            "2": {
            type: Boolean,
            required: true
            },
            "3": {
            type: Boolean,
            required: true
            },
            "4": {
            type: Boolean,
            required: true
            }
        },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const Product = model('product', productSchema);
productSchema.post('save', handleMongooseError);

const addProductSchema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().valid(...productsCategoryList).required(),
    calories: Joi.number().required(),
    weight: Joi.string().required(), 
    groupBloodNotAllowed: Joi.object({
    "1": Joi.boolean().required(),
    "2": Joi.boolean().required(),
    "3": Joi.boolean().required(),
    "4": Joi.boolean().required(),
  }).required(),
})


const schemas = {
  addProductSchema,

};
module.exports = { Product, schemas };
