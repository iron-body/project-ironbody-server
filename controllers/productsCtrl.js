const { Product } = require("../models/productModel");

const productsFilter = async (req, res) => {
  try {
    const {
      title,
      category,
      bloodtype,
      recommended,
      page = 0,
      limit = 0,
    } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (bloodtype) {
      const bloodField = `groupBloodNotAllowed.${bloodtype}`;
      query[bloodField] = recommended === "true";
    }

    const result = await Product.find(query, {}, { skip, limit });

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Not found - please change your query" });
    }

    res.json(result);
  } catch (error) {
    // Обработка ошибок, если таковые возникнут при выполнении запроса к базе данных
    res
      .status(500)
      .json({ error: "Произошла ошибка при фильтрации продуктов" });
  }
};

module.exports = {
  productsFilter,
};
