const { ProductCategories } = require("../models/productCategories");

const productCategoriesList = async (req, res) => {
  const result = await ProductCategories.find();

  res.status(200).json(result);
};

module.exports = productCategoriesList;
