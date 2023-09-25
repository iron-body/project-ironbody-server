const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const filterSchema = new Schema(
  {
    
    
    filter: {
      type: String,
      required: true,
    
    },
   
    name: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
  },
 
  { versionKey: false, timestamps: true }
);




const Filter = model("filter", filterSchema)

const showFiltersSchema = Joi.object({
  filter: Joi.string().required(),
  name: Joi.string().required(),
  imgUrl: Joi.string().required(),
});



const schemas = {
  showFiltersSchema
};

module.exports = { Filter, schemas };