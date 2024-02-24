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
const Education = require("../models/education.models");
const Experience = require("../models/experience.models");
const Project = require("../models/project.models");
const LinkHub = require("../models/linkhub.models");

const {generateNextEducationId} = require("../routes/education");
const {generateNextExperienceId} = require("../routes/experience");
const {generateNextProjectId} = require("../routes/project");
const {generateNextLinkHubId} = require("../routes/linkhub");

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
        },
        {
          $lookup: {
            from: "linkhubs", 
            localField: "user_id", 
            foreignField: "user_id", 
            as: "Links"
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
    const user = await getAllDetails(req.params.id,res);

    if (user.length === 0) {
        return res.status(404).send({ status: 404, message: "User not found." });
    }

    return res.status(200).json({ status: 200, data: user });
  } catch (error) {
      return res.status(500).send({ status: 500, message: error.message });
  }
});

// Search user by Id
// Authorized only for Customers to get their own details
router.get("/:id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const user = await getAllDetails(req.params.id,res);

    if (user.length === 0) {
        return res.status(404).send({ status: 404, message: "User not found." });
    }

    return res.status(200).json({ status: 200, data: user });
  } catch (error) {
      return res.status(500).send({ status: 500, message: error.message });
  }
});

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
        title: body.title,
        first_name: body.first_name,
        last_name: body.last_name,
        job_title: body.job_title,
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
/* router.put("/:id", cors(), authenticateCustomerToken, async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ user_id: req.params.id });

  if (req.email == user.email) {
    if (user == null) {
      return res.status(404).send({ status: 404, message: "User not found." });
    }
    user.title = body.title;
    user.first_name = body.first_name;
    user.last_name = body.last_name;
    user.job_title = body.job_title;
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
}); */

router.put("/:id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ user_id: req.params.id });

    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found." });
    }

    if (req.email !== user.email) {
      return res.status(403).send({ status: 403, message: "Access denied." });
    }

    // Update user fields
    user.title = body.title;
    user.first_name = body.first_name;
    user.last_name = body.last_name;
    user.job_title = body.job_title;
    // user.email = body.email;
    // user.password = body.password;
    user.city = body.city;
    user.country = body.country;
    user.contact_no = body.contact_no;
    user.gender = body.gender;
    user.user_role = body.user_role;

    const updatedUser = await user.save();

   /*  let educationList = body.Education;
    let experienceList = body.Experiences;
    let projectList = body.Projects;
    let linkList = body.Links; */
    
    /* // Handle educations
    if (educationList.length > 0) {
      for (let i = 0; i < educationList.length; i++) {
        let education = educationList[i];
        
        if(education.education_id) { // Attempt to update an existing record
          await Education.findOneAndUpdate({ user_id: req.params.id, education_id: education.education_id }, education, { new: true });

        } else { // Create a new record with a new education_id
          const newEducation = new Education({
            ...education,
            user_id: req.params.id,
            education_id: await generateNextEducationId() // Assuming this function generates a unique education_id
          });
          await newEducation.save();
        }
      }
    } 

    // Handle experiences
    if (experienceList.length > 0) {
      for (let i = 0; i < experienceList.length; i++) {
        let experience = experienceList[i];
        
        if(experience.experience_id) { // Attempt to update an existing record
          await Experience.findOneAndUpdate({ user_id: req.params.id, experience_id: experience.experience_id }, experience, { new: true });

        } else { // Create a new record with a new experience_id
          const newExperience = new Experience({
            ...experience,
            user_id: req.params.id,
            experience_id: await generateNextExperienceId() // Assuming this function generates a unique experience_id
          });
          await newExperience.save();
        }
      }
    }

    // Handle projects
    if (projectList.length > 0) {
      for (let i = 0; i < projectList.length; i++) {
        let project = projectList[i];
        
        if(project.project_id) { // Attempt to update an existing record
          await Project.findOneAndUpdate({ user_id: req.params.id, project_id: project.project_id }, project, { new: true });

        } else { // Create a new record with a new project_id
          const newProject = new Project({
            ...project,
            user_id: req.params.id,
            project_id: await generateNextProjectId() // Assuming this function generates a unique project_id
          });
          await newProject.save();
        }
      }
    }

    // Handle links
    if (linkList.length > 0) {
      for (let i = 0; i < linkList.length; i++) {
        let link = linkList[i];
        
        if(link.linkhub_id) { // Attempt to update an existing record
          await LinkHub.findOneAndUpdate({ user_id: req.params.id, linkhub_id: link.linkhub_id }, link, { new: true });

        } else { // Create a new record with a new linkhub_id
          const newLinkSet = new LinkHub({
            ...link,
            user_id: req.params.id,
            linkhub_id: await generateNextLinkHubId() // Assuming this function generates a unique linkhub_id
          });
          await newLinkSet.save();
        }
      }
    } */

    const userInfo = await getAllDetails(req.params.id,res);

    return res.send({
      status: 200,
      user: userInfo,
      message: "User and related information updated successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ status: 400, message: err.message });
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


async function getAllDetails(user_id,res) {
  try{
    const pipeline = [
      {
          $match: {
              user_id: Number(user_id) // Filter to get the specific user by user_id
          }
      },
      {
          $lookup: {
              from: "educations", 
              localField: "user_id", 
              foreignField: "user_id", 
              as: "Education"
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
      },
      {
          $lookup: {
              from: "linkhubs", 
              localField: "user_id", 
              foreignField: "user_id", 
              as: "Links"
          }
      }
    ];
  
    const userInfo = await User.aggregate(pipeline);
    return userInfo;

  } catch(error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
}

module.exports = router;