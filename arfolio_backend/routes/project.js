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

const Project = require("../models/project.models");

// Get all project - in use
router.get("/getAll", cors(), async (req, res) => {
    try {
      const projectList = await Project.find();
      return res.status(200).json({ status: 200, data: projectList });
    } catch (error) {
      return res.status(500).send({ status: 500, message: error });
    }
});

// Get next project id - in use
// Authorized for Customers
router.get("/next/id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
      // Get the last inserted project from the database
      const lastId = await Project.findOne(
        {},
        {},
        { sort: { project_id: -1 } }
      );
      let nextId = 1;
  
      if (lastId) {
        nextId = lastId.project_id + 1;
      }
  
      res.send({
        status: 200,
        data: { next_project_id: nextId },
      });
    } catch (error) {
      res.status(500).send({status: 500, message: error});
    }
}); 

// Search project by Id
// Authorized for Customers
router.get(
    "/search/:id",
    cors(),
    authenticateCustomerToken,
    async (req, res) => {
      try {
        const verified = verifyToken(req.headers.authorization, res);
  
        const projectFound = await Project.findOne({
            project_id: req.params.id,
            user_id: verified.user_id,
        });
  
        if (!projectFound) {
          return res
            .status(404)
            .send({ status: 404, message: "Project details not found." });
        }
  
        return res.send({
          status: 200,
          data: projectFound,
        });
      } catch (err) {
        return res.status(400).send({ status: 400, message: err.message });
      }
    }
);

// Save project - in use
// Authorized for Customers
router.post("/", cors(), authenticateCustomerToken, async (req, res) => {
    const body = req.body;

    try {
        const verified = verifyToken(req.headers.authorization, res);

        // Check if education already exists
        const projectExist = await Project.findOne({ project_title: body.project_title, project_link: body.project_link, user_id: verified.user_id });
        if (projectExist) {
            return res
            .status(400)
            .json({ status: 400, message: "Similar project already exists." });
        }
  
        // Get the last inserted project_id from the database
        const lastProject = await Project.findOne(
            {},
            {},
            { sort: { project_id: -1 } }
        );
        let nextProjectId = 1;
    
        console.log("lastProject: " + lastProject);
    
        if (lastProject) {
            nextProjectId = lastProject.project_id + 1;
        }
        console.log("nextProjectId: " + nextProjectId);
    
        // Create a new project instance
        const newProject = new Project({
            project_id: nextProjectId,
            project_title: body.project_title,
            project_link: body.project_link,
            description: body.description,
            start_month: body.start_month,
            start_year: body.start_year,
            end_month: body.end_month,
            end_year: body.end_year,
            user_id: verified.user_id,
        });
    
        // Save the project to the database
        const saveProject = await newProject.save();
        res.status(201).send({
            status: 201,
            data: saveProject,
            message: "Project saved successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
}); 

// Update project - in use
// Authorized for Customers
router.put("/:id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const body = req.body;
        const projectExist = await Project.findOne({
            project_id: req.params.id,
        });
    
        if (projectExist == null) {
            return res
            .status(404)
            .send({ status: 404, message: "Project not found." });
        }
        projectExist.project_title = body.project_title;
        projectExist.project_link = body.project_link;
        projectExist.description = body.description;
        projectExist.start_month = body.start_month;
        projectExist.start_year = body.start_year;
        projectExist.end_month = body.end_month;
        projectExist.end_year = body.end_year;
        projectExist.user_id = verified.user_id;
    
        // Update the project in the database
        const updatedProject = await projectExist.save();
        return res.status(200).send({
            status: 200,
            user: updatedProject,
            message: "Project updated successfully!",
        });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
});

// Delete project - in use
// Authorized for Customers
router.delete("/:id", cors(), authenticateCustomerToken, async (req, res) => {
    try {
        const verified = verifyToken(req.headers.authorization, res);

        const projectExist = await Project.findOne({
            project_id: req.params.id,
            user_id: verified.user_id,
        });
        if (projectExist == null) {
            return res
            .status(404)
            .send({ status: 404, message: "Project details not found." });
        }
        let deletedProject = await Project.deleteOne(projectExist);
    
        return res.status(200).send({
            status: 200,
            message: "Project deleted successfully!",
            data: deletedProject,
        });
        } catch (err) {
        return res.status(400).send({ status: 400, message: err.message });
        }
});

module.exports = router;