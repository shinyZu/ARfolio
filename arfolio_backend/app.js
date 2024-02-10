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

// const token = require("./routes/token");
// const login = require("./routes/login");
// const user = require("./routes/user");
// const stationery = require("./routes/stationery");
// const category = require("./routes/category");
// const orders = require("./routes/orders");
// const orderDetails = require("./routes/orderDetail");
// const billingDetail = require("./routes/billingDetail");

// app.use(`${baseURL}token`, token);
// // app.use(`${baseURL}login`, login);
// app.use(`${baseURL}login`, login.router);
// app.use(`${baseURL}user`, user);
// app.use(`${baseURL}stationery`, stationery.router);
// app.use(`${baseURL}category`, category);
// app.use(`${baseURL}orders`, orders);
// app.use(`${baseURL}orderdetails`, orderDetails);
// app.use(`${baseURL}billingdetails`, billingDetail);

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