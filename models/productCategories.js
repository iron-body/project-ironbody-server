const { Schema, model } = require('mongoose');
const handleMongooseError = require('../helpers');
const Joi = require('joi');

const productsCategoryList = [
  'alcoholic drinks',
  'berries',
  'cereals',
  'dairy',
  'dried fruits',
  'eggs',
  'fish',
  'flour',
  'fruits',
  'meat',
  'mushrooms',
  'nuts',
  'oils and fats',
  'poppy',
  'sausage',
  'seeds',
  'sesame',
  'soft drinks',
  'vegetables and herbs',
];

const productCategoriesSchema = new Schema({ categories: [...productsCategoryList] });
