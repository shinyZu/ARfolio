const mongoose = require("mongoose");
const validator = require("validator");

// Creating of a schema in "arfolio" database
const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (val) {
        return /[A-z|0-9]{4,}@(gmail)(.com|.lk)/.test(val);
      },
      message: (val) => "Invalid Email!",
    },
  },

  password: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: function (val) {
    //     return /[a-z0-9]{8}/.test(val);
    //   },
    //   message: (val) => "Invalid Password!",
    // },
    minLength: [8, "Password should be at least 8 characters"],
    maxlength: 1024,
  },

  // user_id: {
  //   type: Number,
  //   required: true,
  // },

  user_role: {
    type: String,
    required: true,
  },
});

// export loginSchema as a model
module.exports = mongoose.model("Login", loginSchema);

/* 
Mongoose model 
  - is a wrapper on the Mongoose schema.
  - provides an interface to the database for creating, querying, updating, deleting records, etc.
Mongoose schema
  - defines the structure of the document, default values, validators, etc., 
*/