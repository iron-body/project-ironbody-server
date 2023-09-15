const express = require('express');
const router = express.Router();
const { schemas } = require('../../models/product');
// const { validateBody, auth, upload } = require('../../middlewares');
const ctrl = require('../../controllers/products');
router.get('/', ctrl.listProducts);


module.exports = router;