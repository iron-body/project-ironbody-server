const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const productSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validate(value) {
          return value >= 1;
        },
      },
    },
    calories: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validate(value) {
          return value >= 1;
        },
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
    collection: "product",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Product = model("Product", productSchema);
productSchema.post("save", handleMongooseError);

const addProductSchema = Joi.object({
  owner: Joi.string().required(),
  amount: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
  date: Joi.string()
    .regex(/^(\d{2})-(\d{2})-(\d{4})$/)
    .required(),
  name: Joi.string().required(),
});
const updateProductSchema = Joi.object({
  done: Joi.boolean().required(),
});

const schemas = {
  addProductSchema,
  updateProductSchema,
};
module.exports = { Product, schemas };
