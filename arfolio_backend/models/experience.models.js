const mongoose = require("mongoose");
const validator = require("validator");

const experienceSchema = new mongoose.Schema({
  experience_id: {
    type: Number,
    required: true,
    unique: true,
  },

  job_title: {
    type: String,
    required: true,
  },

  employer: {
    type: String,
    required: true,
  },

  employer_link: {
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
    required: true,
  },
  
  end_year: {
    type: String,
    required: true,
  },

  user_id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Experience", experienceSchema);
