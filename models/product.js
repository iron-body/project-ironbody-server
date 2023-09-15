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
//       "weight": 100,
//   "calories": 112,
//   "category": "fish",
//   "title": "marlin",
//   "groupBloodNotAllowed": {
//     "1": false,
//     "2": false,
//     "3": false,
//     "4": false
//   }

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
           type: Boolean,
           default: false, 
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
module.exports = { Product, schemas };
