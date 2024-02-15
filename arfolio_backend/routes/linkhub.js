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

const LinkHub = require("../models/linkhub.models");

// Get all LinkHub - in use
router.get("/getAll", cors(), async (req, res) => {
    try {
      const links = await LinkHub.find();
      return res.status(200).json({ status: 200, data: links });
    } catch (error) {
      return res.status(500).send({ status: 500, message: error });
    }
});

// Save links - in use
// Authorized for Customers
router.post("/", cors(), authenticateCustomerToken, async (req, res) => {
    const body = req.body;

    try {
        const verified = verifyToken(req.headers.authorization, res);

        // Check if a link set already exists for the user_id
        const existingHub = await LinkHub.findOne({ user_id: verified.user_id });
        if (existingHub) {
            // If a link set already exists, return a message to update instead of creating a new one
            return res.status(409).send({
                status: 409,
                message: "Link set already available, please update it."
            });
        }

        // Get the last inserted links_id from the database
        const lastHub = await LinkHub.findOne(
            {},
            {},
            { sort: { linkhub_id: -1 } }
        );
        let nextHubId = 1;
    
        console.log("lastHub: " + lastHub);
    
        if (lastHub) {
            nextHubId = lastHub.linkhub_id + 1;
        }
        console.log("nextHubId: " + nextHubId);
    
        // Create a new linkhub instance
        const newHub = new LinkHub({
            linkhub_id: nextHubId,
            linkedin: body.linkedin,
            website: body.website,
            github: body.github,
            twitter: body.twitter,
            instagram: body.instagram,
            spotify: body.spotify,
            facebook: body.facebook,
            user_id: verified.user_id,
        });
    
        // Save the linkhub to the database
        const savedHub = await newHub.save();
        res.status(201).send({
            status: 201,
            data: savedHub,
            message: "Links saved successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
}); 

// Update links - in use
// Authorized for Customers
router.put("/:id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const body = req.body;
        const hubExist = await LinkHub.findOne({
            linkhub_id: req.params.id,
        });
    
        if (hubExist == null) {
            return res
            .status(404)
            .send({ status: 404, message: "No associated links found." });
        }
        hubExist.linkedin = body.linkedin;
        hubExist.website = body.website;
        hubExist.github = body.github;
        hubExist.twitter = body.twitter;
        hubExist.instagram = body.instagram;
        hubExist.spotify = body.spotify;
        hubExist.facebook = body.facebook;
        hubExist.user_id = verified.user_id;
    
        // Update the linkhub in the database
        const updatedLinkHub = await hubExist.save();
        return res.status(200).send({
            status: 200,
            user: updatedLinkHub,
            message: "Links updated successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
});

// Delete links - in use
// Authorized for Customers
router.delete("/:id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const linkhubExist = await LinkHub.findOne({
            linkhub_id: req.params.id,
            user_id: verified.user_id,
        });
        if (linkhubExist == null) {
            return res
            .status(404)
            .send({ status: 404, message: "Links not found." });
        }
        let deletedLinks = await LinkHub.deleteOne(linkhubExist);
    
        return res.status(200).send({
            status: 200,
            message: "Links deleted successfully!",
            data: deletedLinks,
        });
        } catch (err) {
        return res.status(400).send({ status: 400, message: err.message });
        }
});


module.exports = router;