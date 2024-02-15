const mongoose = require("mongoose");
const validator = require("validator");

const projectSchema = new mongoose.Schema({
  project_id: {
    type: Number,
    required: true,
    unique: true,
  },

  project_title: {
    type: String,
    required: true,
  },

  project_link: {
    type: String,
    required: true,
  },

  description: {
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

module.exports = mongoose.model("Project", projectSchema);
