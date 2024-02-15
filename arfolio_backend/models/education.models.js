const mongoose = require("mongoose");
const validator = require("validator");

const educationSchema = new mongoose.Schema({
  education_id: {
    type: Number,
    required: true,
    unique: true,
  },

  school: {
    type: String,
    required: true,
  },

  degree: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  start_month: {
    type: String,
    required: true,
  },
  
  start_year: {
    type: String,
    required: true,
  },
  
  end_month: {
    type: String,
    required: false,
  },
  
  end_year: {
    type: String,
    required: false,
  },

  user_id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Education", educationSchema);
