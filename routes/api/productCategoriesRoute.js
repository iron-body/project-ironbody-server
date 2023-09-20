const express = require('express');
const productCategoriesList = require('../../controllers/productsCategoriesCtrl');

const productCategoriesRoute = express.Router();

productCategoriesRoute.get('/', productCategoriesList);

module.exports = productCategoriesRoute;
