// Буде видалено, хай ще тут полежить.
const { UserData } = require('../models/user_data');
const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAllusers = async (req, res) => {
  const result = await User.find();
  res.json(result);
};

const userDataProductsList = async (req, res) => {
  const result = await UserData.find(
    {}
    // {
    //   height: 0,
    //   currentWeight: 0,
    //   desiredWeight: 0,
    //   birthday: 0,
    //   blood: 0,
    //   sex: 0,
    //   levelActivity: 0,
    //   createdAt: 0,
    //   updatedAt: 0,
    // }
  );

  res.status(200).json(result);
};

const userDataProductsAdd = async (req, res) => {
  const { date, productItem } = req.body;
  const { productId: userId } = req.params;

  if (!productItem) {
    HttpError(400).json({ message: 'Something wrong with product Object!' });
  }

  if (!date) {
    HttpError(400).json({ message: 'You need to send a date!' });
  }

  if (!userId) {
    HttpError(400).json({ message: 'You need to send a userId!' });
  }

  const resultItem = await UserData.findOneAndUpdate(
    { owner: userId },
    {
      $push: { diary: { date } },
      // $push: { 'diary.date.productsDiary': { ...productItem } },
      // 'diary.date': { $push: { productsDiary: { ...productItem } } },
      // diary: { date: date },
    },
    { new: true }
    // {
    //   'diary.date': date,
    //   $push: { 'diary.productsDiary': { ...productItem } },
    // },
  );

  res.json(resultItem);
};

const userDataProductRemove = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  const userData = await UserData.findOneAndUpdate(
    { owner: userId },
    { $pull: { 'diary.productsDiary': { _id: productId } } },
    { new: true }
  );

  if (!userData.owner) {
    HttpError(404, 'Not found');
  }

  console.log(userData);
  console.log(productId);
  console.log(userId);
  res.json({ userData });
};

module.exports = {
  userDataProductsList: ctrlWrapper(userDataProductsList),
  userDataProductsAdd: ctrlWrapper(userDataProductsAdd),
  getAllusers: ctrlWrapper(getAllusers),
  userDataProductRemove: ctrlWrapper(userDataProductRemove),
};

// test product id - 650d574db7e48aed743ff56f
// test user id - 650c10739f87cb37cd74e5f5
