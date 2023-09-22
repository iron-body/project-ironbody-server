const express = require('express');
const moment = require('moment');

const router = express.Router();
const { HttpError } = require('../../helpers/index');
const { schemas, UserData } = require('../../models/user_data');
const { validateBody, auth } = require('../../middlewares/index');

const formatDate = date => {
  return moment(date).utc();
};

// Функція для обчислення норм
const calculateNorms = async (req, res) => {
  const { height, currentWeight, desiredWeight, birthday, blood, sex, levelActivity } = req.body;

  const { error } = schemas.userDataSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.details[0].message);
  }

  const formattedBirthday = formatDate(birthday);

  // Перевірка чи є користувач повнолітнім
  const today = new Date();
  const birthDate = new Date(formattedBirthday);
  let age;
  if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
    age = today.getFullYear() - birthDate.getFullYear() - 1;
  } else {
    age = today.getFullYear() - birthDate.getFullYear();
  }

  if (age < 18) {
    throw HttpError(400, 'Користувач повинен бути старше 18 років');
  }

  // Обчислення BMR (розрахункова кількість калорій в спокійному стані)
  let bmr;
  if (sex === 'male') {
    bmr = (10 * desiredWeight + 6.25 * height - 5 * age + 5) * levelActivity;
  } else if (sex === 'female') {
    bmr = (10 * desiredWeight + 6.25 * height - 5 * age - 161) * levelActivity;
  } else {
    throw HttpError(400, 'Invalid data');
  }
  // const normsData = new UserData({
  //   height,
  //   currentWeight,
  //   desiredWeight,
  //   birthday,
  //   blood,
  //   sex,
  //   levelActivity,
  // });

  console.log('birthDate :>> ', birthDate);

  const normsData = new UserData({
    height,
    currentWeight,
    desiredWeight,
    birthday: birthDate, // Используем отформатированную дату
    blood,
    sex,
    levelActivity,
  });

  // console.log('formattedBirthday', formattedBirthday);
  // const agetest = new Date() - formattedBirthday;
  // console.log('agetest :>> ', agetest);
  // Запсуємо обэкт в БД
  await normsData.save();
  // Денна норма калорій
  const calorieNorm = bmr;
  // Денна норма часу, присвяченого спорту
  const sportTimeNorm = 110; // 110 хвилин на добу
  res.status(200).json({ calorieNorm, sportTimeNorm });
};

router.post('/calculate', auth, validateBody(schemas.calculateSchema), calculateNorms);

module.exports = router;
