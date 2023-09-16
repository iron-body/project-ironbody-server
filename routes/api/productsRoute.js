const express = require('express');
const router = express.Router();
const { schemas } = require('../../models/productModel');
// const { validateBody, auth, upload } = require('../../middlewares');
const ctrl = require('../../controllers/productsCtrl');
router.get('/categories', ctrl.categoriesProducts);

module.exports = router;
