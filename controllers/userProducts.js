const { HttpError, ctrlWrapper } = require('../helpers');
const { UserProduct } = require('../models/userProduct');
const moment = require('moment');
const { registerCtrl } = require('./users');

const getDateWithZeroHour = date =>
  new Date(
    `${new Date(date).getUTCFullYear()}-${new Date(date).getUTCMonth() + 1}-${new Date(
      date
    ).getUTCDate()}`
  );

const getUserProduct = async (req, res) => {
  const { userProductId, date } = req.params;
  const { _id: userId } = req.user;
  // Check if exist
  const getProduct = await UserProduct.findOne(
    {
      owner: userId,
      productid: userProductId,
      date: date,
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

  const dateWithZeroHour = getDateWithZeroHour(date);

  // Get total items
  const totalItems = await UserProduct.countDocuments({
    owner: userId,
    ...(date && {
      date: {
        $lte: moment(dateWithZeroHour).endOf('day').toDate(),
        $gte: moment(dateWithZeroHour).startOf('day').toDate(),
      },
    }),
  });

  const dataList = await UserProduct.find({
    owner: userId,
    ...(date && {
      date: {
        $lte: moment(dateWithZeroHour).endOf('day').toDate(),
        $gte: moment(dateWithZeroHour).startOf('day').toDate(),
      },
    }),
  })
    .limit(+limit)
    .skip(startFrom);

  if (!dataList) {
    throw HttpError(404, 'Not found!');
  }

  const summCalories = dataList.reduce((acuum, product) => {
    return Math.ceil(product.calories + acuum);
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
  const { date, calories } = req.body;

  const zeroHourDate = getDateWithZeroHour(date);

  const existingProduct = await UserProduct.findOne({
    owner: req.user._id,
    date: zeroHourDate,
    title: req.body.title,
  });

  if (existingProduct) {
    const updatedExistingProduct = await UserProduct.findOneAndUpdate(
      { title: req.body.title, owner: req.user._id, date: zeroHourDate },
      { ...req.body, calories: Math.ceil((calories * req.body.amount) / 100), date: zeroHourDate },
      { new: true }
    );

    return res.status(200).json({ updatedExistingProduct });
  }

  const newProduct = await UserProduct.create({
    ...req.body,
    date: zeroHourDate,
    owner: req.user._id,
    calories: Math.ceil((calories * req.body.amount) / 100),
  });

  res.status(200).json({
    newProduct,
  });
};

const deleteUserProduct = async (req, res) => {
  const { userProductId } = req.params;
  const { date } = req.query;
  const { _id: userId } = req.user;

  if (!userProductId || !date) {
    throw HttpError(400, 'For deleting a product you need to provide date and product ID');
  }

  const dateWithZeroHour = getDateWithZeroHour(date);

  const query = {};
  userProductId && (query._id = userProductId);
  userId && (query.owner = userId);
  date && (query.date = dateWithZeroHour);

  // Check if exist
  const getProduct = await UserProduct.findOne(query);

  if (!getProduct) {
    throw HttpError(404, `The product with id "${userProductId}" not found`);
  }

  // Delete product
  const deletedProduct = await UserProduct.deleteOne(query, {
    includeResultMetadata: false,
  });

  if (deletedProduct.deletedCount === 1) {
    return res.status(200).json({
      ok: `The product with id "${userProductId}" was successfully deleted`,
      deletedCount: deletedProduct.deletedCount,
      id: userProductId,
    });
  } else
    return res.status(404).json({
      notOk: `The product with id "${userProductId}" not found`,
      deleledCount: deletedProduct.deletedCount,
      id: userProductId,
    });
};

module.exports = {
  createUserProduct: ctrlWrapper(createUserProduct),
  deleteUserProduct: ctrlWrapper(deleteUserProduct),
  getAllUserProducts: ctrlWrapper(getAllUserProducts),
  getUserProduct: ctrlWrapper(getUserProduct),
};
