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

const Education = require("../models/education.models");

// Get all education - in use
router.get("/getAll", cors(), async (req, res) => {
    try {
      const educationList = await Education.find();
      return res.status(200).json({ status: 200, data: educationList });
    } catch (error) {
      return res.status(500).send({ status: 500, message: error });
    }
});

// Get next education id - in use
// Authorized for Customers
router.get("/next/id", cors(), authenticateCustomerToken, async (req, res) => {
    let nextId = await generateNextEducationId();

    return res.send({
        status: 200,
        data: { next_education_id: nextId },
      }); 
});  

// Search education by Id
// Authorized for Customers
router.get(
    "/search/:id",
    cors(),
    authenticateCustomerToken,
    async (req, res) => {
      try {
        const verified = verifyToken(req.headers.authorization, res);
  
        const educationFound = await Education.findOne({
          education_id: req.params.id,
          user_id: verified.user_id,
        });
  
        if (!educationFound) {
          return res
            .status(404)
            .send({ status: 404, message: "Education details not found." });
        }
  
        return res.send({
          status: 200,
          data: educationFound,
        });
      } catch (err) {
        return res.status(400).send({ status: 400, message: err.message });
      }
    }
);

// Search education by user_id - in use
// Authorized for Customers
router.get(
    "/search/by/user",
    cors(),
    authenticateCustomerToken,
    async (req, res) => {
      try {
        const verified = verifyToken(req.headers.authorization, res);
  
        const educationFound = await Education.find({
          user_id: verified.user_id,
        });
  
        if (!educationFound) {
          return res
            .status(404)
            .send({ status: 404, message: "Education details not found." });
        }
  
        return res.send({
          status: 200,
          data: educationFound,
        });
      } catch (err) {
        return res.status(400).send({ status: 400, message: err.message });
      }
    }
);

// Save education - in use
// Authorized for Customers
router.post("/", cors(), authenticateCustomerToken, async (req, res) => {
    const body = req.body;

    try {
        const verified = verifyToken(req.headers.authorization, res);

        // Check if education already exists
        const educationExist = await Education.findOne({ degree: body.degree, user_id: verified.user_id });
        if (educationExist) {
            return res
            .status(400)
            .json({ status: 400, message: "Similar education already exists." });
        }
  
        // Get the last inserted education_id from the database
        const lastEducation = await Education.findOne(
            {},
            {},
            { sort: { education_id: -1 } }
        );
        let nextEducationId = 1;
    
        console.log("lastEducation: " + lastEducation);
    
        if (lastEducation) {
            nextEducationId = lastEducation.education_id + 1;
        }
        console.log("nextEducationId: " + nextEducationId);
    
        // Create a new education instance
        const newEducation = new Education({
            education_id: nextEducationId,
            school: body.school,
            degree: body.degree,
            city: body.city,
            country: body.country,
            start_month: body.start_month,
            start_year: body.start_year,
            end_month: body.end_month,
            end_year: body.end_year,
            user_id: verified.user_id,
        });
    
        // Save the education to the database
        const savedEducation = await newEducation.save();
        res.status(201).send({
            status: 201,
            data: savedEducation,
            message: "Education saved successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
});   

// Update education (as a single object)- in use
// Authorized for Customers
router.put("/:id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const body = req.body;
        const educationExist = await Education.findOne({
            education_id: req.params.id,
        });
    
        if (educationExist == null) {
            return res
            .status(404)
            .send({ status: 404, message: "Education not found." });
        }
        educationExist.school = body.school;
        educationExist.degree = body.degree;
        educationExist.city = body.city;
        educationExist.country = body.country;
        educationExist.start_month = body.start_month;
        educationExist.start_year = body.start_year;
        educationExist.end_month = body.end_month;
        educationExist.end_year = body.end_year;
        educationExist.user_id = verified.user_id;
    
        // Update the education in the database
        const updatedEducation = await educationExist.save();
        return res.status(200).send({
            status: 200,
            data: updatedEducation,
            message: "Education updated successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
});

// Update education (as a list) - in use
// Authorized for Customers
router.put("/update/bulk", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const educationList = req.body;
        let updatedEducation;

        if (educationList.length > 0) {
          for (let i = 1; i < educationList.length; i++) {
            let education = educationList[i];
            
            if(education.education_id) { // Attempt to update an existing record
              updatedEducation = await Education.findOneAndUpdate({ user_id: verified.user_id, education_id: education.education_id }, education, { new: true });
    
            } else { // Create a new record with a new education_id
              const newEducation = new Education({
                ...education,
                user_id: verified.user_id,
                education_id: await generateNextEducationId() // Assuming this function generates a unique education_id
              });
              updatedEducation = await newEducation.save();
            }
          }
        } 

        const educationFound = await Education.find({
          user_id: verified.user_id,
        });

        // Update the education in the database
        return res.status(200).send({
            status: 200,
            data: educationFound,
            message: "Education updated successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
});

/* router.put("/", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const verified = verifyToken(req.headers.authorization, res);

    const { user_id, education_id } = req.query;

    if (!verified.user_id) {
      return res.status(403).send({ status: 403, message: "Unauthorized access." });
    }

    const educations = req.body; // This is now an array of education objects

    // Get the last inserted education_id from the database
    const lastEducation = await Education.findOne({}, {}, { sort: { education_id: -1 } });
    let nextEducationId = lastEducation ? lastEducation.education_id + 1 : 1;

    console.log("nextEducationId", nextEducationId)

    // Process each education record
    const operations = educations.map(async (education) => {
      if (!education.education_id) {
        // Assign a new education_id for new records
        education.education_id = nextEducationId++;
      }

      const filter = { user_id: verified.user_id, education_id: education.education_id };
      const update = { $set: education };
      const options = { new: true, upsert: true, returnOriginal: false };

      return Education.findOneAndUpdate(filter, update, options);
    });

    // Wait for all the operations to complete
    const results = await Promise.all(operations);

    return res.status(200).send({
      status: 200,
      educations: results,
      message: "Educations processed successfully!",
    });
  } catch (err) {
    console.error(err); // Log the error to the console for debugging
    return res.status(400).send({ status: 400, message: err.message });
  }
}); */

// Delete education - in use
// Authorized for Customers
router.delete("/:id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const educationExist = await Education.findOne({
            education_id: req.params.id,
            user_id: verified.user_id,
        });
        if (educationExist == null) {
            return res
            .status(404)
            .send({ status: 404, message: "Education details not found." });
        }
        let deletedEducation = await Education.deleteOne(educationExist);
    
        return res.status(200).send({
            status: 200,
            message: "Education deleted successfully!",
            data: deletedEducation,
        });
        } catch (err) {
        return res.status(400).send({ status: 400, message: err.message });
        }
});

const generateNextEducationId = async () => {
  try {
    // Get the last inserted education from the database
    const lastId = await Education.findOne(
      {},
      {},
      { sort: { education_id: -1 } }
    );
    let nextId = 1;

    if (lastId) {
      nextId = lastId.education_id + 1;
    }

    console.log("=======next education id===========", nextId)
    return nextId;
  } catch (error) {
    res.status(500).send({status: 500, message: error});
  }
}

module.exports = {router, generateNextEducationId};