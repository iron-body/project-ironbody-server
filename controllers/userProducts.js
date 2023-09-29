const { HttpError, ctrlWrapper } = require('../helpers');
const { UserProduct } = require('../models/userProduct');
const moment = require('moment');

const getUserProduct = async (req, res) => {
  const { userProductId, date } = req.params;
  const { _id: userId } = req.user;
  const formattedDate = moment(date, 'DD/MM/YYYY');
  // Check if exist
  const getProduct = await UserProduct.findOne(
    {
      owner: userId,
      productid: userProductId,
      date: formattedDate,
    },
    { createdAt: 0, updatedAt: 0, owner: 0 }
  );

  if (!getProduct) {
    throw HttpError(404, `The product with id "${id}" not found`);
  }

  res.status(200).json(getProduct);
};

const getAllUserProducts = async (req, res) => {
  const { _id: userId } = req.user;
  const { limit = 25, page = 1, date } = req.query;
  const startFrom = (+page - 1) * +limit;

  const formattedDate = moment.utc(date, 'DD/MM/YYYY');
  // Get total items
  const totalItems = await UserProduct.countDocuments({
    owner: userId,
    ...(date && {
      date: {
        $lte: moment(formattedDate).endOf('day').toDate(),
        $gte: moment(formattedDate).startOf('day').toDate(),
      },
    }),
  });

  const dataList = await UserProduct.find({
    owner: userId,
    ...(date && {
      date: {
        $lte: moment(formattedDate).endOf('day').toDate(),
        $gte: moment(formattedDate).startOf('day').toDate(),
      },
    }),
  })
    .limit(+limit)
    .skip(startFrom);

  if (!dataList) {
    throw HttpError(404, 'Not found!');
  }

  const summCalories = dataList.reduce((acuum, product) => {
    return product.calories + acuum;
  }, 0);

  res.status(200).json({
    dataList,
    limit,
    page,
    totalItems,
    totalPages: totalItems ? Math.ceil(+totalItems / +limit) : 0,
    summCalories,
  });
};

const createUserProduct = async (req, res) => {
  const { date } = req.body;
  const formattedDate = moment.utc(date, 'DD/MM/YYYY');

  const newProduct = await UserProduct.create({
    ...req.body,
    date: formattedDate,
    owner: req.user._id,
  });

  const updatedProduct = await UserProduct.findOneAndUpdate(
    { _id: newProduct._id, owner: req.user._id, date: formattedDate },
    {
      $mul: { calories: req.body.amount / 100 },
    },
    { new: true }
  );

  res.status(200).json({
    newProduct,
    updatedProduct,
  });
};

const deleteUserProduct = async (req, res) => {
  const { userProductId } = req.params;
  const { date } = req.query;
  const { _id: userId } = req.user;

  if (!userProductId || !date) {
    throw HttpError(400, 'For deleting a product you need to provide date and product ID');
  }
  const formattedDate = moment.utc(date, 'DD/MM/YYYY');

  const query = {};
  userProductId && (query.productid = userProductId);
  userId && (query.owner = userId);
  date && (query.date = formattedDate);

  // Check if exist
  const getProduct = await UserProduct.findOne(query);

  if (!getProduct) {
    throw HttpError(404, `The product with id "${userProductId}" not found`);
  }
  // Delete product
  const deletedProduct = await UserProduct.deleteOne(query);

  res.status(200).json({
    ok: `The product with id "${userProductId}" was successfully deleted`,
    deletedProduct,
  });
};

module.exports = {
  createUserProduct: ctrlWrapper(createUserProduct),
  deleteUserProduct: ctrlWrapper(deleteUserProduct),
  getAllUserProducts: ctrlWrapper(getAllUserProducts),
  getUserProduct: ctrlWrapper(getUserProduct),
};
