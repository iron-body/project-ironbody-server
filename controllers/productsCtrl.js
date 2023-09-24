const { HttpError, ctrlWrapper } = require('../helpers');
const { Product } = require('../models/productModel');

const productsFilter = async (req, res) => {
  let result;

  const { title, category, bloodtype, recommended, page = 0, limit = 0 } = req.query;
  const skip = (page - 1) * limit;
  // console.log('main title', title, Boolean(title));
  // console.log('main category', category, Boolean(category));
  // console.log('main bloodtype', bloodtype, Boolean(bloodtype));
  // console.log('main recommended', recommended, typeof recommended);
  // console.log('main boolean true', Boolean(recommended));
  // console.log('main boolean false', Boolean(!recommended));
  // Блок без умов групи крові
  if (title && !category && !bloodtype && recommended === 'all') {
    result = await Product.find(
      {
        title: { $regex: `${title}`, $options: 'i' },
      },
      {},
      { skip, limit }
    );
  } else if (!title && category && !bloodtype && recommended === 'all') {
    result = await Product.find({ category });
  } else if (title && category && !bloodtype && recommended === 'all') {
    result = await Product.find(
      {
        title: { $regex: `${title}`, $options: 'i' },
        category: category,
      },
      {},
      { skip, limit }
    );
  }
  // ЗАБОРОНЕНА для цього подукту, група крові. Блок без пошукових запитів
  else if (!title && !category && bloodtype && recommended === 'true') {
    if (bloodtype === '1') {
      result = await Product.find(
        {
          'groupBloodNotAllowed.1': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '2') {
      result = await Product.find(
        {
          'groupBloodNotAllowed.2': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '3') {
      result = await Product.find(
        {
          'groupBloodNotAllowed.3': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '4') {
      result = await Product.find(
        {
          // groupBloodNotAllowed: { [bloodtype]: Boolean(recommended) }, // по документації мало б працювати - брати значення bloodtype, в даному випадку це 4, і приводити recommended до булевого значення. По факту - пустий масив, результатів не витягує
          'groupBloodNotAllowed.4': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
  }
  // ДОЗВОЛЕНА для цього продукту, група крові. Блок без пошукових запитів
  else if (!title && !category && bloodtype && recommended === 'false') {
    if (bloodtype === '1') {
      result = await Product.find({
        'groupBloodNotAllowed.1': Boolean(!recommended),
      });
    }
    if (bloodtype === '2') {
      result = await Product.find(
        {
          'groupBloodNotAllowed.2': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '3') {
      result = await Product.find({
        'groupBloodNotAllowed.3': Boolean(!recommended),
      });
    }
    if (bloodtype === '4') {
      result = await Product.find(
        {
          'groupBloodNotAllowed.4': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
  }
  // ЗАБОРОНЕНА для цього подукту, група крові. Блок з пошуком по title
  else if (title && !category && bloodtype && recommended === 'true') {
    if (bloodtype === '1') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          'groupBloodNotAllowed.1': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '2') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          'groupBloodNotAllowed.2': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '3') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          'groupBloodNotAllowed.3': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '4') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          'groupBloodNotAllowed.4': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
  }
  // ДОЗВОЛЕНА для цього продукту, група крові. Блок з пошуком по title
  else if (title && !category && bloodtype && recommended === 'false') {
    if (bloodtype === '1') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          'groupBloodNotAllowed.1': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '2') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          'groupBloodNotAllowed.2': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '3') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          'groupBloodNotAllowed.3': { $eq: Boolean(!recommended) },
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '4') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          'groupBloodNotAllowed.4': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
  }
  // ЗАБОРОНЕНА для цього подукту, група крові. Блок з пошуком по category
  else if (!title && category && bloodtype && recommended === 'true') {
    if (bloodtype === '1') {
      result = await Product.find(
        {
          category: category,
          'groupBloodNotAllowed.1': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '2') {
      result = await Product.find(
        {
          category: category,
          'groupBloodNotAllowed.2': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '3') {
      result = await Product.find(
        {
          category: category,
          'groupBloodNotAllowed.3': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '4') {
      result = await Product.find(
        {
          category: category,
          'groupBloodNotAllowed.4': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
  }
  // ДОЗВОЛЕНА для цього продукту, група крові. Блок з пошуком по category
  else if (!title && category && bloodtype && recommended === 'false') {
    if (bloodtype === '1') {
      result = await Product.find(
        {
          category: category,
          'groupBloodNotAllowed.1': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '2') {
      result = await Product.find(
        {
          category: category,
          'groupBloodNotAllowed.2': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '3') {
      result = await Product.find(
        {
          category: category,
          'groupBloodNotAllowed.3': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '4') {
      result = await Product.find(
        {
          category: category,
          'groupBloodNotAllowed.4': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
  }
  // ЗАБОРОНЕНА для цього подукту, група крові. Блок з пошуком по category & title
  else if (title && category && bloodtype && recommended === 'true') {
    if (bloodtype === '1') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          category: category,
          'groupBloodNotAllowed.1': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '2') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          category: category,
          'groupBloodNotAllowed.2': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '3') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          category: category,
          'groupBloodNotAllowed.3': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '4') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          category: category,
          'groupBloodNotAllowed.4': Boolean(recommended),
        },
        {},
        { skip, limit }
      );
    }
  }
  // ДОЗВОЛЕНА для цього продукту, група крові. Блок з пошуком по category & title
  else if (title && category && bloodtype && recommended === 'false') {
    if (bloodtype === '1') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          category: category,
          'groupBloodNotAllowed.1': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '2') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          category: category,
          'groupBloodNotAllowed.2': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '3') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          category: category,
          'groupBloodNotAllowed.3': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
    if (bloodtype === '4') {
      result = await Product.find(
        {
          title: { $regex: `${title}`, $options: 'i' },
          category: category,
          'groupBloodNotAllowed.4': Boolean(!recommended),
        },
        {},
        { skip, limit }
      );
    }
  }
  // А тут віддається все що є в базі - дефолтний запит
  else {
    // console.log('all');
    result = await Product.find({}, {}, { skip, limit });
  }

  if (!result.length) {
    return res.status(404).json({ message: 'Not found - please change your query' });
  }

  res.json(result);
};

module.exports = {
  productsFilter: ctrlWrapper(productsFilter),
};
