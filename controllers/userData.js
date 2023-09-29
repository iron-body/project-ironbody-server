const { ctrlWrapper } = require("../helpers");
const { UserData } = require("../models/user_data");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  //   const { page = 1, limit = 10, favorite } = req.query;

  //   // ? в find 3-й пар - дод налашт - є вбудовані skip та limit
  //   const skip = (page - 1) * limit;

  // ? додаю id при отриманні контактів щоб видавалися контакти тільки цієї людини
  const data = await UserData.find(
    { owner },
    "-createdAt -updatedAt"
    //         {
    //     skip,
    //     limit,
    //     favorite,
    //   }).populate("owner", "name email"); // ? додаємо populate щоб отр повну інформацію по полю яке є аргументом/ !другий аргумент, це уточнення, якщо не потр все! // ? дозв підкл фільтрацію
  ).populate("owner", "name email");
  res.status(200).json(data);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
};
