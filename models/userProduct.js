const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const userProductsSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 1,
      validate: {
        validator: function (value) {
          return value >= 1;
        },
        message: "Amount must be greater than or equal to 1",
      },
    },
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
    collection: "userProduct",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const UserProduct = model("userProduct", userProductsSchema);
userProductsSchema.post("save", handleMongooseError);

const addUserProductsSchema = Joi.object({
  owner: Joi.object().required(),
  amount: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
  date: Joi.date().required(),
  done: Joi.boolean().required(),
  name: Joi.string().required(),
});

const updateUserProductsSchema = Joi.object({
  done: Joi.boolean().required(),
});

const userProductsSchemas = {
  userProductsSchema,
  updateUserProductsSchema,
};
module.exports = { UserProduct, userProductsSchemas };
