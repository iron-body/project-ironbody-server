const express = require('express');
const userProductsRouter = express.Router();
const { userProductsSchemas } = require('../../models/userProduct');
const { validateBody, auth } = require('../../middlewares');
const ctrl = require('../../controllers/products');
userProductsRouter.get('/', auth, ctrl.getAllProducts);
userProductsRouter.get('/:id', auth, ctrl.getProduct);
userProductsRouter.delete('/:id', auth, ctrl.deleteProduct);
userProductsRouter.post('/', auth, validateBody(userProductsSchemas.addUserProductsSchema));
userProductsRouter.patch('/:id', auth, validateBody(userProductsSchemas.updateUserProductsSchema));

module.exports = userProductsRouter;
