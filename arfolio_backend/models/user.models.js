const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  first_name: {
    type: String,
    required: true,
  },

  last_name: {
    type: String,
    required: true,
  },

  job_title: {
    type: String,
    required: true,
  },

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
    // pattern: "^[a-z0-9]{8}$",
    minLength: [8, "Password should be at least 8 characters"],
    maxlength: 1024,
  },

  country: {
    type: String,
    required: false,
  },

  city: {
    type: String,
    required: true,
  },

  contact_no: {
    type: Number,
    required: true,
    unique: true,
    // validate: [(val) => val.length === 10, "Invalid Phone No"],
    validate: {
      validator: function (val) {
        return val.toString().length === 9;
      },
      // message: (val) => `${val.value} has to be 9 digits`,
      message: "Invalid Contact Number!",
    },
  },

  gender: {
    type: String,
    required: false,
  },

  user_role: {
    type: String,
    required: true,
  },

  image_name: {
    type: String,
    // required: true,
  },

  image_url: {
    type: String,
    // required: true,
  },
});

// userSchema.pre("deleteOne", async function (next) {
//   console.log(this._conditions.user_id);
//   const userId = this._conditions.user_id;

//   // Check if any orders are associated with the user
//   const orders = await mongoose.model("Orders").find({ user_id: userId });

//   if (orders.length > 0) {
//     return next(new Error("Cannot delete users associated with orders."));
//   }

//   next();
// });

module.exports = mongoose.model("User", userSchema);
