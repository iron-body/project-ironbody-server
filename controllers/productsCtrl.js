const { HttpError, ctrlWrapper } = require('../helpers');
const { Product } = require('../models/productModel');
const { UserData } = require('../models/user_data');

const productsFilter = async (req, res) => {
  const { user } = req;

  const userData = await UserData.findOne({ owner: user._id });

  const { category, isNotAllowed, title } = req.query;

  if (!userData) {
    throw HttpError(409, 'User data is absent. Please fill in the registration data');
  }

  const query = {};
  category && (query.category = category);
  isNotAllowed !== undefined && (query[`groupBloodNotAllowed.${userData.blood}`] = isNotAllowed);
  title && (query.title = { $regex: title, $options: 'i' });

  const result = await Product.find(query);

  const mutableArray = result.map(product => ({
    ...product._doc,
    recommended: !product._doc.groupBloodNotAllowed[userData.blood],
  }));

  res.json(mutableArray);
};

module.exports = {
  productsFilter: ctrlWrapper(productsFilter),
};
