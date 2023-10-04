const { ctrlWrapper, HttpError } = require('../helpers');
const { UserData } = require("../models/user_data");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fs = require("fs/promises");
// const { updateNameAvatarSchema } = require("../models/user");
const { SECRET_KEY } = process.env;


const getAll = async (req, res) => {
  // ? додаємо id юзера
  const { _id: owner } = req.user;

//   const { page = 1, limit = 10, favorite } = req.query;


//   // ? в find 3-й пар - дод налашт - є вбудовані skip та limit
//   const skip = (page - 1) * limit;

    const data = await UserData.find({ owner }, "-createdAt -updatedAt",
//         {
//     skip,
//     limit,
//     favorite,
//   }).populate("owner", "name email"); // ? додаємо populate щоб отр повну інформацію по полю яке є аргументом/ !другий аргумент, це уточнення, якщо не потр все! // ? дозв підкл фільтрацію
    )
  res.status(200).json(data);
};


module.exports = {
  getAll: ctrlWrapper(getAll),
 
};