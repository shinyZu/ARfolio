const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  authenticateAdminToken,
  authenticateCustomerToken,
} = require("../middleware/auth");

const app = express();
const cors = require("cors");
const router = express.Router();
const axios = require("axios");

const mongoose = require("mongoose");

const User = require("../models/user.models");

// -------------------
const login = require("./login");
const baseURL = "/arfolio/api/v1/";
// -------------------

// Get all users
// Authorized only for Admins
router.get("/getAll", cors(), authenticateAdminToken, async (req, res) => {
    try {
      // const users = await User.find();

      const users = await User.aggregate([
        {
          $lookup: {
            from: "educations", // the collection name in MongoDB
            localField: "user_id", // the field from the User collection
            foreignField: "user_id", // the corresponding field in the Education collection
            as: "Education" // the name of the field where the joined data will be placed
          }
        },
        {
          $lookup: {
            from: "experiences", 
            localField: "user_id", 
            foreignField: "user_id", 
            as: "Experiences"
          }
        },
        {
          $lookup: {
            from: "projects", 
            localField: "user_id", 
            foreignField: "user_id", 
            as: "Projects"
          }
        }
      ]);

      return res.status(200).json({ status: 200, data: users });
    } catch (error) {
      return res.status(500).send({ status: 500, message: error });
    }
});

// Search user by Id
// Authorized only for Admins
router.get("/admin/:id", cors(), authenticateAdminToken, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.id });
    if (user == null) {
      return res.status(404).send({ status: 404, message: "User not found." });
    }

    /* const userId = req.params.id;
    console.log("Looking for userId:", userId); // Debugging log

    const pipeline = [
      {
        $match: { user_id: userId } // Or use _id: new mongoose.Types.ObjectId(userId) if matching against MongoDB's _id
      },
      {
        $lookup: {
          from: "educations", // Ensure this matches the actual name of your collection in MongoDB
          localField: "user_id", // This should be the field in the User document that references the user's ID
          foreignField: "user_id", // This should be the field in the Education document that references the user's ID
          as: "Education" // The result of the lookup will be stored in this field
        }
      },
      {
        $limit: 1 // Since you're expecting to find only one user
      }
    ];

    const result = await User.aggregate(pipeline);
    console.log("Aggregation result:", result); // Debugging log

    // if (user == null) {
    if (result.length === 0) {
      return res.status(404).send({ status: 404, message: "User not found." });
    }

    // Since the aggregation returns an array, you'll need to get the first element.
    const user = result[0]; */
    
    return res.send({ status: 200, data: user,});
  } catch (err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
});

// Search user by Id
// Authorized only for Customers to get their own details
router.get("/:id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.id });
    if (req.email == user.email) {
      if (user == null) {
        return res
          .status(404)
          .send({ status: 404, message: "User not found." });
      }
      return res.send({
        status: 200,
        data: user,
      });
    } else {
      return res.status(403).send({ status: 403, messge: "Access denied." });
    }
  } catch (err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
});

// TODO - return Users with Education, Experience,....
/* router.get("/:id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    // const userId = req.params.id; // Capture the userId from the URL parameter
    const userId = new mongoose.Types.ObjectId(req.params.userId); // Convert to ObjectId

    const pipeline = [
      {
        $match: {
          user_id: userId // Assuming user_id is the field you use to identify users in the User collection
        }
      },
      {
        $lookup: {
          from: 'educations', // Assumes your education details are stored in a collection named 'educations'
          let: { userId: '$user_id' }, // Use the user_id from the matched User document
          pipeline: [
            {
              $match: {
                $expr: {
                  // Ensure the education document's user_id matches the User document's user_id
                  $eq: ['$user_id', '$$userId']
                }
              }
            }
          ],
          as: 'EducationDetails' // The resulting array of matched education documents will be stored in this field
        }
      }
    ];

    const usersWithEducation = await User.aggregate(pipeline);

    if (usersWithEducation.length === 0) {
      return res.status(404).send({ status: 404, message: "User not found or has no education details." });
    }

    return res.status(200).json({ status: 200, data: usersWithEducation });
  } catch (error) {
    console.error("Error fetching user education details:", error);
    return res.status(500).send({ status: 500, message: "Internal server error" });
  }
}); */

// Register User - in use
router.post("/register", cors(), async (req, res) => {
    const body = req.body;
  
    try {
      // Check if user already exists
      const emailExist = await User.findOne({ email: body.email });
      if (emailExist) {
        return res
          .status(400)
          .json({ status: 400, message: "Email already exists." });
      }
  
      const contactExist = await User.findOne({ contact_no: body.contact_no });
      if (contactExist) {
        return res
          .status(400)
          .send({ status: 400, message: "Contact number already exists." });
      }
  
      // Get the last inserted user_id from the database
      const lastUser = await User.findOne({}, {}, { sort: { user_id: -1 } });
      let nextUserId = 1;
  
      if (lastUser) {
        nextUserId = lastUser.user_id + 1;
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);
  
      // Create a new user instance
      const user = new User({
        user_id: nextUserId,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: hashedPassword,
        city: body.city,
        country: body.country,
        contact_no: body.contact_no,
        gender: body.gender,
        user_role: body.user_role,
      });
  
      // Save the user to the database
      const savedUser = await user.save();
      console.log("======savedUser=======")
      console.log(savedUser)
  
      // Call login() in login router
      let tokenData = await login.generateToken(
        nextUserId,
        body.email,
        hashedPassword,
        body.user_role,
        res
      );
      console.log("=============== tokenData in user.js: ===============");
      console.log(tokenData);
  
      if (savedUser && tokenData) {
        // send response after registering & login
        return res.status(201).send({
          status: 201,
          message: "User registered successfully!",
          data: tokenData,
        });
      } else {
        return res.status(400).send({ status: 400, message: "Failed to login." });
      }
    } catch (err) {
      return res.status(400).send({statuus: 400, message: err.message});
    }
});

// Update User
// Authorized only for Customers to get their own details
router.put("/:id", cors(), authenticateCustomerToken, async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ user_id: req.params.id });

  if (req.email == user.email) {
    if (user == null) {
      return res.status(404).send({ status: 404, message: "User not found." });
    }
    user.first_name = body.first_name;
    user.last_name = body.last_name;
    // user.email = body.email;
    // user.password = body.password;
    user.city = body.city;
    user.country = body.country;
    user.contact_no = body.contact_no;
    user.gender = body.gender;
    user.user_role = body.user_role;

    // Update the user in the database
    const updatedUser = await user.save();
    return res.send({
      status: 200,
      user: updatedUser,
      message: "User updated successfully!",
    });
  } else {
    return res.status(403).send({ status: 403, messge: "Access denied." });
  }
});

// Delete Customer Account
// Authorized only for Customers to delete their own account
router.delete("/:id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const userExist = await User.findOne({
      user_id: req.params.id,
    });
    if (req.email == userExist.email) {
      if (userExist == null) {
        return res
          .status(404)
          .send({ status: 404, message: "User not found." });
      }
      let deletedUser = await User.deleteOne(userExist);

      return res.send({
        status: 200,
        message: "User deleted successfully!",
        data: deletedUser,
      });
    } else {
      return res.status(403).send({ status: 403, messge: "Access denied." });
    }
  } catch (err) {
    return res.status(400).send({ statttus: 400, message: err.message });
  }
});

module.exports = router;