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
    amount: {
      type: Number,
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
    date: {
      type: Date,
      required: true,
    },
    done: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
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

const updateUserProductsSchema = Joi.object({
  done: Joi.boolean().required(),
});

const userProductsSchemas = {
  userProductsSchema,
  updateUserProductsSchema,
};
module.exports = { UserProduct, userProductsSchemas };
