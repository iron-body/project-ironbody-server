const { Schema, model } = require("mongoose");

const exerciseSchema = new Schema(
  {
    
    time: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validator: function (value) {
          return value >= 1;
        },
        message: "Time must be at least 1",
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
        message: "Calories must be at least 1",
      },
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return !isNaN(value);
        },
        message: "Invalid date format",
      },
    },
    name: {
      type: String,
      required: true,
    },
    // // done: {
    // //   type: Boolean,
    // //   required: true,
    // // },
  },

  { versionKey: false, timestamps: true }
);

const Exercise = model("exercise", exerciseSchema)




module.exports = { Exercise };
