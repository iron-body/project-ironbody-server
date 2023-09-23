const { UserData } = require('../models/user_data');
const { User } = require('../models/user');

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
  const { body: newProductItem } = req;
  const { productId: userId } = req.params;
  //   const resultItem = await UserData.updateOne(
  //     { 'diary.date': { $eq: newProductItem.date } },
  //     { _id: productId, ...newProductItem },
  //     { upsert: true }
  //   );
  // const userToCheckBloodType = await UserData.find({});
  console.log(newProductItem);
  console.log('productId', userId);
  // const resultItem = await UserData.find({ _id: productId });
  const resultItem = await UserData.findOneAndUpdate(
    { _id: '650d574db7e48aed743ff56f' },

    { 'diary.date': '22/09/2023', $push: { 'diary.productsDairy': { ...newProductItem } } },
    { new: true }
  );
  // console.log('resultItem.diary', resultItem.diary);
  //
  res.json(resultItem);
};

module.exports = { userDataProductsList, userDataProductsAdd, getAllusers };

// test id - 650d574db7e48aed743ff56f
