const mongoose = require("mongoose");
const validator = require("validator");

const linkHubSchema = new mongoose.Schema({
  linkhub_id: {
    type: Number,
    required: true,
    unique: true,
  },

  linkedin: {
    type: String,
    required: true,
  },

  website: {
    type: String,
    required: false,
  },

  github: {
    type: String,
    required: false,
  },
  
  instagram: {
    type: String,
    required: false,
  },
  
  twitter: {
    type: String,
    required: false,
  },
  
  spotify: {
    type: String,
    required: false,
  },
  
  facebook: {
    type: String,
    required: false,
  },

  user_id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("LinkHub", linkHubSchema);
