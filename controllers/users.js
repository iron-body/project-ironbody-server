const { ctrlWrapper, HttpError } = require("../helpers");
const { User } = require("../models/user");
const { UserData, userDataSchemas } = require("../models/user_data");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

// дата реєстраціі

// Функція для реєстрації нового користувача
const registerCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    next(HttpError(409, "User with such email already exists"));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarUrl,
  });

  const newUserDBData = await User.findOne({ email });
  const payload = { id: newUserDBData._id };

  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(newUserDBData._id, {
    accessToken,
  });

  res.status(201).json({
    user: { name: newUser.name, email: newUser.email },
    accessToken,
    registrationDate: newUser.registrationDate,
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

  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { accessToken });
  res.status(200).json({
    accessToken,
  });
};

const getCurrentCtrl = async (req, res) => {
  const { name, email, avatarUrl } = req.user;
  res.status(200).json({ name, email, avatarUrl });
};

const logoutCtrl = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: null });
  res.json({ message: "Logout success" });
};

// Функція для обчислення норм
const calculateNormsCtrl = async (req, res, next) => {
  const {
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
  } = req.body;
  const { _id: owner, name, email } = req.user;
  const { error } = userDataSchemas.userDataSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.details[0].message);
  }

  const formattedBirthday = new Date(birthday).toISOString();

  // Перевірка чи є користувач повнолітнім
  const today = new Date();
  const birthDate = new Date(formattedBirthday);
  let age;
  if (
    today <
    new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  ) {
    age = today.getFullYear() - birthDate.getFullYear() - 1;
  } else {
    age = today.getFullYear() - birthDate.getFullYear();
  }
  if (age < 18) {
    next(HttpError(400, "Користувач повинен бути старше 18 років"));
    return;
  }
  // Обчислення BMR (розрахункова кількість калорій в спокійному стані)
  let bmr;
  if (sex === "male") {
    bmr = (10 * desiredWeight + 6.25 * height - 5 * age + 5) * levelActivity;
  } else if (sex === "female") {
    bmr = (10 * desiredWeight + 6.25 * height - 5 * age - 161) * levelActivity;
  } else {
    throw HttpError(400, "Invalid data");
  }

  console.log("birthDate :>> ", birthDate);
  // Денна норма калорій
  const calorieNorm = bmr;
  // Денна норма часу, присвяченого спорту
  const sportTimeNorm = 110; // 110 хвилин на добу
  // Звіряємо, чи існує вже запис користувача у колекції "userData".
  const existingUserData = await UserData.findOne({ owner: owner });
  if (existingUserData) {
    // Якщо запис існує, то викидаємо помилку, оскільки запис "userData" для даного користувача вже існує.
    throw HttpError(400, "Для даного користувача вже  існує запис userData");
  }
  const normsData = new UserData({
    name,
    email,
    height,
    currentWeight,
    desiredWeight,
    birthday: birthDate, // використовуємо форматовану дату
    blood,
    sex,
    levelActivity,
    calorieNorm,
    sportTimeNorm,
    owner,
  });
  // Запсуємо обэкт в БД
  await normsData.save();

  res.status(200).json({ calorieNorm, sportTimeNorm });
};




// const updateUserCtrl = async (req, res) => {
//   const { _id } = req.user;
//   const { name, avatarUrl } = req.body;
//   if (name || avatarUrl) {
//     const updatedData = {};
//     if (name) {
//       updatedData.name = name;
//     }
//     if (avatarUrl) {
//       updatedData.avatarUrl = avatarUrl;
//     }
//     const updatedUser = await User.findByIdAndUpdate(_id, updatedData, {
//       new: true,
//     });
//     if (!updatedUser) {
//       throw HttpError(404, "User not found");
//     }
//     res.status(200).json({
//       name: updatedUser.name,
//       avatarUrl: updatedUser.avatarUrl,
//     });
//   } else {
//     throw HttpError(400, "No changes provided");
//   }
// };
const updateNameAvatarCtrl = async (req, res) => {
  const { _id } = req.user;
  const { name, avatarUrl } = req.body;
  // const { path: tempUpload, originalname } = req.file;

  try {
    // const filename = `${_id}_${originalname}`;
    // const resultUpload = path.join(avatarsDir, filename);
    // const resizeImage = await Jimp.read(tempUpload);
    // await resizeImage.resize(250, 250);
    // await resizeImage.writeAsync(tempUpload);
    // await fs.rename(tempUpload, resultUpload);

    const updatedData = {};
    if (name) {
      updatedData.name = name;
    }
    if (avatarUrl) {
      updatedData.avatarUrl = path.join("public", "avatars", filename);
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
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

// оновлення даних користувача
const updateParamsUserCtrl = async (req, res) => {
  console.log("Received updateParamsUser request", req.body);
  const { _id: owner } = req.user;

  console.log(owner);
  const {
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
  } = req.body;

  const updatedData = {};

  if (height) {
    updatedData.height = height;
  }
  if (currentWeight) {
    updatedData.currentWeight = currentWeight;
  }
  if (desiredWeight) {
    updatedData.desiredWeight = desiredWeight;
  }
  if (birthday) {
    updatedData.birthday = birthday;
  }
  if (blood) {
    updatedData.blood = blood;
  }
  if (sex) {
    updatedData.sex = sex;
  }
  if (levelActivity) {
    updatedData.levelActivity = levelActivity;
  }
  console.log(owner);
  // перевіряємо, чи існує запис  userData для даного користувача
  const existingUserData = await UserData.findOne({ owner: owner });
  if (!existingUserData) {
    // тут кидаємо помилку, так як запису userData для користувача немає
    throw HttpError(404, "Запис userData для даного користувача не знайдена");
  }
  const updatedUser = await UserData.findOneAndUpdate(
    { owner: owner },
    updatedData,
    {
      new: true,
    }
  );

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }

  console.log("Updated user:", updatedUser);

  res.status(200).json(updatedUser);
  console.log("Updated user:", updatedUser);
};
// const downloadCloudinary = async (req, res) => {};

module.exports = {
  registerCtrl: ctrlWrapper(registerCtrl),
  loginCtrl: ctrlWrapper(loginCtrl),
  logoutCtrl: ctrlWrapper(logoutCtrl),
  getCurrentCtrl: ctrlWrapper(getCurrentCtrl),
  // updateUserCtrl: ctrlWrapper(updateUserCtrl),
  // updateAvatarCtrl: ctrlWrapper(updateAvatarCtrl),
  calculateNormsCtrl: ctrlWrapper(calculateNormsCtrl),
  updateNameAvatarCtrl: ctrlWrapper(updateNameAvatarCtrl),
  updateParamsUserCtrl: ctrlWrapper(updateParamsUserCtrl),
  // downloadCloudinary: ctrlWrapper(downloadCloudinary),
};
