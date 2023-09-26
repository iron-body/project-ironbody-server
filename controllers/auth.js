const { ctrlWrapper, HttpError } = require("../helpers");
const { User } = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const registerCtrl = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarUrl,
  });

  const newUserDBData = User.findOne({ email });
  const payload = { id: newUserDBData._id };

  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(newUserDBData._id, {
    accessToken,
  });

  res.status(201).json({
    user: { name: newUser.name, email: newUser.email },
    accessToken,
  });
};

const loginCtrl = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is not valid");
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is not valid");
  }
  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, {
    accessToken,
  });
  res.status(200).json({
    accessToken,
  });
};

const getCurrentCtrl = (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
};
const logoutCtrl = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: null });
  res.json({ message: "Logout success" });
};
const updateUserCtrl = async (req, res) => {
  const { _id } = req.user;
  const { name, avatarUrl } = req.body;
  if (name || avatarUrl) {
    const updatedData = {};
    if (name) {
      updatedData.name = name;
    }
    if (avatarUrl) {
      updatedData.avatarUrl = avatarUrl;
    }
    const updatedUser = await User.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });
    if (!updatedUser) {
      throw HttpError(404, "User not found");
    }
    res.status(200).json({
      name: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl,
    });
  } else {
    throw HttpError(400, "No changes provided");
  }
};

const updateAvatarCtrl = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const image = await Jimp.read(resultUpload);
  await image.resize(250, 250).write(resultUpload);
  const avatarUrl = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarUrl });

  console.log(avatarUrl);
  res.json({ avatarUrl });
};
const updateNameAvatarCtrl = async (req, res) => {
  const { _id } = req.user;
  const { name, avatarUrl } = req.body;
  if (name || avatarUrl) {
    const updatedData = {};
    if (name) {
      updatedData.name = name;
    }
    if (avatarUrl) {
      updatedData.avatarUrl = avatarUrl;
    }
    const updatedUser = await User.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });
    if (!updatedUser) {
      throw HttpError(404, "User not found");
    }
    res.status(200).json({
      name: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl,
    });
  } else {
    throw HttpError(400, "No changes provided");
  }
};
module.exports = {
  registerCtrl: ctrlWrapper(registerCtrl),
  loginCtrl: ctrlWrapper(loginCtrl),
  logoutCtrl: ctrlWrapper(logoutCtrl),
  getCurrentCtrl: ctrlWrapper(getCurrentCtrl),
  updateUserCtrl: ctrlWrapper(updateUserCtrl),
  updateAvatarCtrl: ctrlWrapper(updateAvatarCtrl),
  updateNameAvatarCtrl,
};
