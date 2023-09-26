const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const productCategoriesSchema = new Schema(
  {
    title: { type: String, required: [true, "Enter name of category"] },
  },
  { versionKey: false, timestamps: true }
);

productCategoriesSchema.post("save", handleMongooseError);

const ProductCategories = model("categories", productCategoriesSchema);

const productCategoriesValidationSchema = Joi.object({
  title: Joi.string().required(),
});

module.exports = { ProductCategories, productCategoriesValidationSchema };
