const { HttpError, ctrlWrapper } = require("../helpers");
const { UserProduct } = require("../models/userProduct");
const moment = require("moment");

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

  // Get total items
  const totalItems = await UserProduct.countDocuments({
    owner: userId,
    ...(date && {
      date: {
        $lte: moment(date, "DD.MM.YYYY").endOf("day").toDate(),
        $gte: moment(date, "DD.MM.YYYY").startOf("day").toDate(),
      },
    }),
  });

  const dataList = await UserProduct.find({
    owner: userId,
    ...(date && {
      date: {
        $lte: moment(date, "DD.MM.YYYY").endOf("day").toDate(),
        $gte: moment(date, "DD.MM.YYYY").startOf("day").toDate(),
      },
    }),
  })
    .limit(+limit)
    .skip(startFrom);

  if (!dataList) {
    throw HttpError(404, "Not found!");
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
  const newProduct = await UserProduct.create({
    ...req.body,
    owner: req.user._id,
  });

  const updatedProduct = await UserProduct.findOneAndUpdate(
    { _id: newProduct._id, owner: req.user._id, date: req.body.date },
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

const updateUserProduct = async (req, res) => {
  const { body, user, params } = req;
  const getProduct = await UserProduct.findOne({
    _id: params.id,
    owner: user._id,
  }).select("_id");
  if (!getProduct) {
    throw HttpError(404, `The product with id "${params.id}" not found`);
  }
  const updatedProduct = await UserProduct.updateOne(
    {
      _id: params.id,
      owner: user._id,
    },
    {
      ...body,
    }
  );
  res.status(200).json({
    updatedProduct,
  });
};

const deleteUserProduct = async (req, res) => {
  const { userProductId } = req.params;
  const { date } = req.query;
  const { _id: userId } = req.user;

  const formattedDate = new Date(date).toISOString();

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
  updateUserProduct: ctrlWrapper(updateUserProduct),
};
