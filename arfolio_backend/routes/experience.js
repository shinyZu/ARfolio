const express = require("express");
const jwt = require("jsonwebtoken");
const {
  authenticateAdminToken,
  authenticateCustomerToken,
  verifyToken,
} = require("../middleware/auth");

const app = express();
const cors = require("cors");
const router = express.Router();

const Experience = require("../models/experience.models");

// Get all experience - in use
router.get("/getAll", cors(), async (req, res) => {
    try {
      const experienceList = await Experience.find();
      return res.status(200).json({ status: 200, data: experienceList });
    } catch (error) {
      return res.status(500).send({ status: 500, message: error });
    }
});

// Get next experience id - in use
// Authorized for Customers
router.get("/next/id", cors(), authenticateCustomerToken, async (req, res) => {
  let nextId = await generateNextExperienceId();
  return res.send({
    status: 200,
    data: { next_experience_id: nextId },
  });
}); 

// Search experience by Id
// Authorized for Customers
router.get(
    "/search/:experience_id",
    cors(),
    authenticateCustomerToken,
    async (req, res) => {
      try {
        const verified = verifyToken(req.headers.authorization, res);
  
        const experienceFound = await Experience.findOne({
            experience_id: req.params.experience_id,
            user_id: verified.user_id,
        });
  
        if (!experienceFound) {
          return res
            .status(404)
            .send({ status: 404, message: "Experience details not found." });
        }
  
        return res.send({
          status: 200,
          data: experienceFound,
        });
      } catch (err) {
        return res.status(400).send({ status: 400, message: err.message });
      }
    }
);

// Save experience - in use
// Authorized for Customers
router.post("/", cors(), authenticateCustomerToken, async (req, res) => {
    const body = req.body;

    try {
        const verified = verifyToken(req.headers.authorization, res);

        // Check if education already exists
        const experienceExist = await Experience.findOne({ job_title: body.job_title, employer: body.employer, user_id: verified.user_id });
        if (experienceExist) {
            return res
            .status(400)
            .json({ status: 400, message: "Similar experience already exists." });
        }
  
        // Get the last inserted experience_id from the database
        const lastExperience = await Experience.findOne(
            {},
            {},
            { sort: { experience_id: -1 } }
        );
        let nextExperienceId = 1;
    
        console.log("lastExperience: " + lastExperience);
    
        if (lastExperience) {
            nextExperienceId = lastExperience.experience_id + 1;
        }
        console.log("nextExperienceId: " + nextExperienceId);
    
        // Create a new experience instance
        const newExperience = new Experience({
            experience_id: nextExperienceId,
            job_title: body.job_title,
            employer: body.employer,
            city: body.city,
            country: body.country,
            start_month: body.start_month,
            start_year: body.start_year,
            end_month: body.end_month,
            end_year: body.end_year,
            employer_link: body.employer_link,
            user_id: verified.user_id,
        });
    
        // Save the experience to the database
        const saveExperience = await newExperience.save();
        res.status(201).send({
            status: 201,
            data: saveExperience,
            message: "Experience saved successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
}); 

// Update experience (as a single object) - in use
// Authorized for Customers
router.put("/:experience_id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const body = req.body;
        const experienceExist = await Experience.findOne({
            experience_id: req.params.experience_id,
        });
    
        if (experienceExist == null) {
            return res
            .status(404)
            .send({ status: 404, message: "Experience not found." });
        }
        experienceExist.job_title = body.job_title;
        experienceExist.employer = body.employer;
        experienceExist.city = body.city;
        experienceExist.country = body.country;
        experienceExist.start_month = body.start_month;
        experienceExist.start_year = body.start_year;
        experienceExist.end_month = body.end_month;
        experienceExist.end_year = body.end_year;
        experienceExist.employer_link = body.employer_link;
        experienceExist.user_id = verified.user_id;
    
        // Update the experience in the database
        const updatedExperience = await experienceExist.save();
        return res.status(200).send({
            status: 200,
            user: updatedExperience,
            message: "Experience updated successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
});

// Update experience (as a list) - in use
// Authorized for Customers
router.put("/update/bulk", cors(), authenticateCustomerToken, async (req, res) => {
  try {
      const verified = verifyToken(req.headers.authorization, res);

      const experienceList = req.body;
      let updatedExperience;

      if (experienceList.length > 0) {
        for (let i = 0; i < experienceList.length; i++) {
          let experience = experienceList[i];

          if(experience.experience_id) { // Attempt to update an existing record
            updatedExperience = await Experience.findOneAndUpdate({ user_id: verified.user_id, experience_id: experience.experience_id }, experience, { new: true });
  
          } else { // Create a new record with a new experience_id
            const newExperience = new Experience({
              ...experience,
              user_id: verified.user_id,
              experience_id: await generateNextExperienceId() // Assuming this function generates a unique experience_id
            });
            updatedExperience = await newExperience.save();
          }
        }
      } 

      const experienceFound = await Experience.find({
        user_id: verified.user_id,
      });

      // Update the education in the database
      return res.status(200).send({
          status: 200,
          data: experienceFound,
          message: "Experience details updated successfully!",
      });
  } catch (err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
});

// Delete experience - in use
// Authorized for Customers
router.delete("/:experience_id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const experienceExist = await Experience.findOne({
            experience_id: req.params.experience_id,
            user_id: verified.user_id,
        });
        if (experienceExist == null) {
            return res
            .status(404)
            .send({ status: 404, message: "Experience details not found." });
        }
        let deletedExperience = await Experience.deleteOne(experienceExist);
    
        return res.status(200).send({
            status: 200,
            message: "Experience deleted successfully!",
            data: deletedExperience,
        });
        } catch (err) {
        return res.status(400).send({ status: 400, message: err.message });
        }
});

const generateNextExperienceId = async () => {
  try {
    // Get the last inserted experience from the database
    const lastId = await Experience.findOne(
      {},
      {},
      { sort: { experience_id: -1 } }
    );
    let nextId = 1;

    if (lastId) {
      nextId = lastId.experience_id + 1;
    }

    
    console.log("=======next experience id===========", nextId)
    return nextId;
  } catch (error) {
    res.status(500).send({status: 500, message: error});
  }
}

module.exports = {router, generateNextExperienceId};