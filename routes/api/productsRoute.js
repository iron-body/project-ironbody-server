const express = require('express');
const router = express.Router();
const { productsFilter } = require('../../controllers/productsCtrl');
// const { schemas } = require('../../models/productModel');
const { auth } = require('../../middlewares');

router.get('/', auth, productsFilter);

module.exports = router;
