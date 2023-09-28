const express = require('express');
const userProductsRouter = express.Router();

const { userProductsSchemas } = require('../../models/userProduct');
const { validateBody, auth } = require('../../middlewares');
const userProductsCtrl = require('../../controllers/userProducts');

userProductsRouter.get('/', auth, userProductsCtrl.getAllUserProducts);
userProductsRouter.get('/:userProductId', auth, userProductsCtrl.getUserProduct);
userProductsRouter.delete('/:userProductId', auth, userProductsCtrl.deleteUserProduct);
userProductsRouter.post(
  '/',
  auth,
  validateBody(userProductsSchemas.addUserProductsSchema),
  userProductsCtrl.createUserProduct
);
userProductsRouter.patch('/:id', auth, validateBody(userProductsSchemas.updateUserProductsSchema));

module.exports = userProductsRouter;
