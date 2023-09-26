const { ctrlWrapper, HttpError } = require("../helpers");
const { UserData } = require("../models/user_data");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fs = require("fs/promises");
const { SECRET_KEY } = process.env;

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const data = await UserData.find({ owner }, "-createdAt -updatedAt").populate(
    "owner",
    "name email"
  );
  res.status(200).json(data);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
};
