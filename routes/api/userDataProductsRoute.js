const express = require('express');
const {
  userDataProductsList,
  userDataProductsAdd,
  getAllusers,
  userDataProductRemove,
} = require('../../controllers/userDataProductsCtrl');
const auth = require('../../middlewares/auth');

const userDataProductsRouter = express.Router();

userDataProductsRouter.get('/allUsers', getAllusers);

userDataProductsRouter.get('/', userDataProductsList);

userDataProductsRouter.post('/:productId', userDataProductsAdd);

userDataProductsRouter.delete('/:productId', userDataProductRemove);

module.exports = userDataProductsRouter;
