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

// Функція для реєстрації нового користувача
const registerCtrl = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use"); // Помилка 409 - Конфлікт
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarUrl,
  });
  res.status(201).json({
    user: { name: newUser.name, email: newUser.email },
  });
};

// Функція для входу користувача
const loginCtrl = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is not valid"); // Помилка 401 - Не авторизовано
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is not valid");
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  // const refreshToken = jwt.sign({}, SECRET_KEY, { expiresIn: "7d" });
  // console.log(refreshToken)
  await User.findByIdAndUpdate(user._id, { accessToken: token });
  console.log(token);
  // refreshToken });
  res.status(200).json({
    token,
    // refreshToken,
  });
};

// // Створюємо маршрут для refresh token
// const refreshCtrl = async (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken) {
//     throw HttpError(401, "Refresh token is required");
//   }
//   console.log("SECRET_KEY:", SECRET_KEY);

//   try {
//     console.log("SECRET_KEY:", SECRET_KEY);

//     const decoded = jwt.verify(refreshToken, SECRET_KEY);
//     console.log("decoded._id:", decoded.id); // Вивести decoded._id до консолі
// console.log("_id користувача в базі даних:", user._id); // Вивести _id користувача до консолі

//     console.log("decoded:", decoded); // Вивести decoded до консолі
//     const user = await User.findById(decoded._id);
//     console.log("decoded._id:", decoded.id); // Вивести decoded._id до консолі
// console.log("_id користувача в базі даних:", user._id); // Вивести _id користувача до консолі

//     console.log("user:", user); // Вивести user до консолі
//     if (!user || !user.token || refreshToken !== user.refreshToken) {
//       throw HttpError(401, "Invalid refresh token");
//     }
//     const payload = { id: user._id };
//     const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
//     console.log("old accessToken:", user.accessToken); // Вивести старий accessToken до консолі
//     await User.findByIdAndUpdate(user._id, { token });
//     console.log("new accessToken:", token); // Вивести новий accessToken до консолі
//     res.status(200).json({
//       token,
//       user: { email: user.email, subscription: user.subscription },
//     });
//   } catch (error) {
//     console.error("Error in refreshCtrl:", error); // Вивести помилку до консолі
//     throw HttpError(401, "Invalid refresh token");
//   }

// };
const logoutCtrl = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({ message: "Logout success" });
};
const getCurrentCtrl = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};
const updateSubscriptionCtrl = async (req, res) => {
  const { _id, subscription } = req.user;
  const newSubscription = req.body.subscription;
  if (newSubscription === subscription) {
    throw HttpError(409, "Invalid subscription"); // Помилка 409 - Конфлікт
  }
  const updatedSubscription = await User.findByIdAndUpdate(
    _id,
    { $set: { subscription: newSubscription } },
    { new: true }
  );
  if (!updatedSubscription) {
    throw HttpError(409, "Not Found"); // Помилка 409 - Конфлікт
  }
  res.status(200).json({
    message: `new subscription is ${updatedSubscription.subscription}`,
  });
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

module.exports = {
  registerCtrl: ctrlWrapper(registerCtrl),
  loginCtrl: ctrlWrapper(loginCtrl),
  logoutCtrl: ctrlWrapper(logoutCtrl),
  getCurrentCtrl: ctrlWrapper(getCurrentCtrl),
  updateSubscriptionCtrl: ctrlWrapper(updateSubscriptionCtrl),
  updateAvatarCtrl: ctrlWrapper(updateAvatarCtrl),
  // refreshCtrl: ctrlWrapper(refreshCtrl),
};
