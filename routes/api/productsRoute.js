const express = require('express');
const router = express.Router();
const { productsFilter } = require('../../controllers/productsCtrl');
const productCategoriesList = require('../../controllers/productsCategoriesCtrl');
const userProductsCtrl = require('../../controllers/userProducts');

const { userProductsSchemas } = require('../../models/userProduct');

const { validateBody, auth } = require('../../middlewares');

router.get('/', auth, productsFilter);

//* productsCategRout
router.get('/categories', auth, productCategoriesList);

//* userProducts
router.get('/userproducts', auth, userProductsCtrl.getAllUserProducts);
router.get('/userproducts/:userProductId', auth, userProductsCtrl.getUserProduct);
router.delete('/userproducts/:userProductId', auth, userProductsCtrl.deleteUserProduct);
router.post(
  '/',
  auth,
  validateBody(userProductsSchemas.addUserProductsSchema),
  userProductsCtrl.createUserProduct
);
router.patch('/userproducts/:id', auth, validateBody(userProductsSchemas.updateUserProductsSchema));

module.exports = router;
