const express = require('express');
const {
  userDataProductsList,
  userDataProductsAdd,
  getAllusers,
} = require('../../controllers/userDataProductsCtrl');

const userDataProductsRouter = express.Router();

userDataProductsRouter.get('/allUsers', getAllusers);

userDataProductsRouter.get('/', userDataProductsList);

userDataProductsRouter.get('/:productId', userDataProductsAdd);

module.exports = userDataProductsRouter;
