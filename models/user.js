const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: emailRegex,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    avatarURL: {
      type: String,
      // required: true,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);
const User = model("user", userSchema);

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().required().min(6),
  // password: Joi.string().pattern(passwordRegex).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  // password: Joi.string().pattern(passwordRegex).required(),
  password: Joi.string().min(6).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().pattern(emailRegex),
  password: Joi.string().min(6),
  // .pattern(passwordRegex)
});
// --------------------------пункт 18-------------------
const updateNameAvatarSchema = Joi.object({
  name: Joi.string().min(2),
  avatarUrl: Joi.string().uri(),
});

const schemas = {
  registerSchema,
  loginSchema,
  userDataSchema,
  // calculateSchema,
  updateUserSchema,
  updateNameAvatarSchema,
};

module.exports = { User, schemas };
