const { HttpError, ctrlWrapper } = require("../helpers");
const { Product } = require("../models/productModel");

const productsFilter = async (req, res) => {
  let result;

  const {
    title,
    category,
    bloodtype,
    recommended,
    page = 0,
    limit = 0,
  } = req.query;
  const skip = (page - 1) * limit;
  if (title && !category && !bloodtype && recommended === "all") {
    result = await Product.find(
      {
        title: { $regex: `${title}`, $options: "i" },
      },
      {},
      { skip, limit }
    );
  } else if (!title && category && !bloodtype && recommended === "all") {
    result = await Product.find({ category });
  } else if (title && category && !bloodtype && recommended === "all") {
    result = await Product.find(
      {
        title: { $regex: `${title}`, $options: "i" },
        category: category,
      },
      {},
      { skip, limit }
    );
  } else if (!title && !category && bloodtype && recommended === "true") {
    if (bloodtype === "1") {
      result = await Product.find(
        {
          "groupBloodNotAllowed.1": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "2") {
      result = await Product.find(
        {
          "groupBloodNotAllowed.2": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "3") {
      result = await Product.find(
        {
          "groupBloodNotAllowed.3": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "4") {
      result = await Product.find(
        {
          "groupBloodNotAllowed.4": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
  } else if (!title && !category && bloodtype && recommended === "false") {
    if (bloodtype === "1") {
      result = await Product.find({
        "groupBloodNotAllowed.1": Boolean(!recommended),
      });
    }
    if (bloodtype === "2") {
      result = await Product.find(
        {
          "groupBloodNotAllowed.2": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "3") {
      result = await Product.find({
        "groupBloodNotAllowed.3": Boolean(!recommended),
      });
    }
    if (bloodtype === "4") {
      result = await Product.find(
        {
          "groupBloodNotAllowed.4": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
  } else if (title && !category && bloodtype && recommended === "true") {
    if (bloodtype === "1") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          "groupBloodNotAllowed.1": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "2") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          "groupBloodNotAllowed.2": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "3") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          "groupBloodNotAllowed.3": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "4") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          "groupBloodNotAllowed.4": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
  } else if (title && !category && bloodtype && recommended === "false") {
    if (bloodtype === "1") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          "groupBloodNotAllowed.1": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "2") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          "groupBloodNotAllowed.2": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "3") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          "groupBloodNotAllowed.3": { $eq: Boolean(!recommended) },
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "4") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          "groupBloodNotAllowed.4": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
  } else if (!title && category && bloodtype && recommended === "true") {
    if (bloodtype === "1") {
      result = await Product.find(
        {
          category: category,
          "groupBloodNotAllowed.1": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "2") {
      result = await Product.find(
        {
          category: category,
          "groupBloodNotAllowed.2": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "3") {
      result = await Product.find(
        {
          category: category,
          "groupBloodNotAllowed.3": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "4") {
      result = await Product.find(
        {
          category: category,
          "groupBloodNotAllowed.4": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
  } else if (!title && category && bloodtype && recommended === "false") {
    if (bloodtype === "1") {
      result = await Product.find(
        {
          category: category,
          "groupBloodNotAllowed.1": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "2") {
      result = await Product.find(
        {
          category: category,
          "groupBloodNotAllowed.2": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "3") {
      result = await Product.find(
        {
          category: category,
          "groupBloodNotAllowed.3": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "4") {
      result = await Product.find(
        {
          category: category,
          "groupBloodNotAllowed.4": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
  } else if (title && category && bloodtype && recommended === "true") {
    if (bloodtype === "1") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          category: category,
          "groupBloodNotAllowed.1": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "2") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          category: category,
          "groupBloodNotAllowed.2": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "3") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          category: category,
          "groupBloodNotAllowed.3": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "4") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          category: category,
          "groupBloodNotAllowed.4": Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
  } else if (title && category && bloodtype && recommended === "false") {
    if (bloodtype === "1") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          category: category,
          "groupBloodNotAllowed.1": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "2") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          category: category,
          "groupBloodNotAllowed.2": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "3") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          category: category,
          "groupBloodNotAllowed.3": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === "4") {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: "i" },
          category: category,
          "groupBloodNotAllowed.4": Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
  } else {
    result = await Product.find({}, {}, { skip, limit });
  }

  if (!result.length) {
    return res
      .status(404)
      .json({ message: "Not found - please change your query" });
  }

  res.json(result);
};

module.exports = {
  productsFilter: ctrlWrapper(productsFilter),
};
