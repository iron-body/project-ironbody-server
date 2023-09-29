const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const userProductsSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: { type: String, required: [true, "You forget to add category"] },
    calories: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validator: function (value) {
          return value >= 1;
        },
        message: "Calories must be greater than or equal to 1",
      },
    },
    amount: {
      type: Number,
      required: [true, "Enter amount of products in gramm"],
      min: 1,
      default: 100,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    productid: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

userProductsSchema.post("save", handleMongooseError);
const UserProduct = model("user_product", userProductsSchema);

const addUserProductsSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  calories: Joi.number().min(1).required(),
  amount: Joi.number().min(1).required(),
  date: Joi.date().required(),
  productid: Joi.allow().required(),
  recommended: Joi.boolean().required(),
});

const updateUserProductsSchema = Joi.object({
  done: Joi.boolean().required(),
  calories: Joi.number().min(1).required(),
  amount: Joi.number().min(1).required(),
});

const userProductsSchemas = {
  addUserProductsSchema,
  updateUserProductsSchema,
};
module.exports = { UserProduct, userProductsSchemas };
