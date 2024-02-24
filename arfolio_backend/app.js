require("dotenv").config();

const express = require("express");
const cors = require("cors"); // to handle CORS issue
// const jwt = require("jsonwebtoken");

const app = express(); // to start a new Express application
app.use(cors());

app.use(express.json());
const { connection } = require("./db.configs/db");

connection.establishConnection; // invoke the method to establish connection with mongoDB

const baseURL = "/arfolio/api/v1/";

const token = require("./routes/token");
const login = require("./routes/login");
const user = require("./routes/user");
const education = require("./routes/education");
const experience = require("./routes/experience");
const project = require("./routes/project");
const linkhub = require("./routes/linkhub");

app.use(`${baseURL}token`, token);
app.use(`${baseURL}login`, login.router);
app.use(`${baseURL}users`, user);
app.use(`${baseURL}education`, education.router);
app.use(`${baseURL}experience`, experience.router);
app.use(`${baseURL}project`, project.router);
app.use(`${baseURL}linkhub`, linkhub.router);

app.get(`${baseURL}/`, (req, res) => {
  console.log(req);
  res.send("<h1>Hello Express!!!</h1>");
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`express app listening on Port ${process.env.PORT}`);
});

/*
 .env
  - file to store your sensitive credentials like API keys, Secret jeys. 
  
  dotenv 
  - a lightweight npm package that automatically loads environment variables from a ".env" file into the process. 
  - a zero-dependency module that loads environment variables from a .env file into process.env.
*/