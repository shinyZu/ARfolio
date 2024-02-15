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
  
      res.send({
        status: 200,
        data: { next_education_id: nextId },
      });
    } catch (error) {
      res.status(500).send({status: 500, message: error});
    }
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

// Update education - in use
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
            user: updatedEducation,
            message: "Education updated successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
});

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

module.exports = router;