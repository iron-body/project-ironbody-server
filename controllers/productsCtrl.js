const { HttpError, ctrlWrapper } = require('../helpers');
const { Product } = require('../models/productModel');
const { UserData } = require('../models/user_data');

const productsFilter = async (req, res) => {
  const { user } = req;

  const userData = await UserData.findOne({ owner: user._id });
  // const userData = await UserData.findOne({ owner: '650c10739f87cb37cd74e5f5' });

  const { category, isNotAllowed, title, page = 0, limit = 0 } = req.query;
  const skip = (page - 1) * limit;

  if (!userData) {
    throw HttpError(404, 'User data is absent. Please fill in the registration data');
  }

  const query = {};
  category && (query.category = category);
  isNotAllowed !== undefined && (query[`groupBloodNotAllowed.${userData.blood}`] = isNotAllowed);
  title && (query.title = { $regex: title, $options: 'i' });

  const result = await Product.find(query, {}, { skip, limit });

  const mutableArray = result.map(product => ({
    ...product._doc,
    recommended: !product._doc.groupBloodNotAllowed[userData.blood],
  }));

  res.json(mutableArray);
};

module.exports = {
  productsFilter: ctrlWrapper(productsFilter),
};
