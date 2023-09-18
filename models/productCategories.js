const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const productCategoriesSchema = new Schema(
  {
    title: { type: String, required: [true, 'Enter name of category'] },
  },
  { versionKey: false, timestamps: true }
);

productCategoriesSchema.post('save', handleMongooseError);

const ProductCategories = model('categories', productCategoriesSchema);

const productCategoriesValidationSchema = Joi.object({ title: Joi.string().required() });

module.exports = { ProductCategories, productCategoriesValidationSchema };

// // Тут код, тимчасово лежить, руцями наповнював базу
// const productsCategoryList = [
//   'alcoholic drinks',
//   'berries',
//   'cereals',
//   'dairy',
//   'dried fruits',
//   'eggs',
//   'fish',
//   'flour',
//   'fruits',
//   'meat',
//   'mushrooms',
//   'nuts',
//   'oils and fats',
//   'poppy',
//   'sausage',
//   'seeds',
//   'sesame',
//   'soft drinks',
//   'vegetables and herbs',
// ];

// const { ProductCategories } = require('./models/productCategories');
// productsCategoryList.map(el => ProductCategories.create({ title: el }));
// ProductCategories.create({ title: 'seeds' });
// const deleteFakeDB = () =>
//   productsCategoryList.map(async el => await ProductCategories.deleteOne({ title: el }));
// console.log(deleteFakeDB());
