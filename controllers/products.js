const { HttpError, ctrlWrapper } = require("../helpers");
const { Product } = require("../models/product");
const moment = require("moment");
const createProduct = async (req, res) => {
  const newProduct = new Product({
    ...req.body,
    owner: req.user._id,
  });
  const { _id } = await newProduct.save();
  res.status(200).json({
    ...req.body,
    id: _id,
  });
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { done = false } = req.body;
  // Check if exist
  const getProduct = await Product.findOne({
    _id: id,
  }).select("_id");
  if (!getProduct) {
    throw HttpError(404, `The product with id "${id}" not found`);
  }
  // Update product
  await Product.updateOne(
    {
      _id: id,
    },
    {
      done,
    }
  );
  res.status(200).json({
    ok: `The product with id "${id}" was successfully updated`,
  });
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  // Check if exist
  const getProduct = await Product.findOne({
    _id: id,
  }).select("_id");
  if (!getProduct) {
    throw HttpError(404, `The product with id "${id}" not found`);
  }
  res.status(200).json(getProduct);
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  // Check if exist
  const getProduct = await Product.findOne({
    _id: id,
  }).select("_id");
  if (!getProduct) {
    throw HttpError(404, `The product with id "${id}" not found`);
  }
  // Delete product
  await Product.deleteOne({
    _id: id,
  });
  res.status(200).json({
    ok: `The product with id "${id}" was successfully deleted`,
  });
};

const getAllProducts = async (req, res) => {
  const { limit = 25, page = 1, date, done } = req.query;
  const startFrom = (+page - 1) * +limit;
  // Get total items
  const totalItems = await Product.countDocuments({
    ...(date && {
      date: {
        $lte: moment(date, "DD.MM.YYYY").endOf("day").toDate(),
        $gte: moment(date, "DD.MM.YYYY").startOf("day").toDate(),
      },
    }),
    ...(typeof done !== "undefined" && {
      done,
    }),
  });
  const dataList = await Product.find({
    ...(date && {
      date: {
        $lte: moment(date, "DD.MM.YYYY").endOf("day").toDate(),
        $gte: moment(date, "DD.MM.YYYY").startOf("day").toDate(),
      },
    }),
    ...(typeof done !== "undefined" && {
      done,
    }),
  })
    .limit(+limit)
    .skip(startFrom);
  res.status(200).json({
    dataList,
    limit,
    page,
    totalItems,
    totalPages: totalItems ? Math.ceil(+totalItems / +limit) : 0,
  });
};
module.exports = {
  createProduct: ctrlWrapper(createProduct),
  updateProduct: ctrlWrapper(updateProduct),
  deleteProduct: ctrlWrapper(deleteProduct),
  getAllProducts: ctrlWrapper(getAllProducts),
  getProduct: ctrlWrapper(getProduct),
};
