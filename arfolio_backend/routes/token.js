const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { refreshToken } = require("../middleware/auth");

const app = express();
var cors = require("cors");
const router = express.Router();

const User = require("../models/user.models");

// Generate Token - test
router.post("/generateToken", cors(), async (req, res) => {
  // Validate User Here - if a user exists in the db with the given credentials
  console.log(req.body.email);

  // Then generate JWT Token
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash(req.body.password, salt);

  let data = {
    time: Date(),
    user_id: 12,
    email: req.body.email,
    password: hashedPassword,
  };

  const token = jwt.sign(data, jwtSecretKey);

  // Format the token as a Bearer token
  const bearerToken = `Bearer ${token}`;

  //res.send(bearerToken);
  res.json({ token: bearerToken });
});

// Validate Token - test
const validateToken = router.get(
  "/user/validateToken",
  cors(),
  async (req, res) => {
    // Tokens are generally passed in the header of the request due to security reasons.

    let tokenHeaderKey = process.env.JWT_TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
      // const token = req.header(tokenHeaderKey);
      const authHeader = req.headers.authorization;
      console.log("authHeader: " + authHeader);

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid token format." });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided." });
      }

      const verified = jwt.verify(token, jwtSecretKey);
      console.log("verified: " + verified);

      if (verified) {
        // return res.send("Successfully Verified!");
        return true;
      } else {
        // Access Denied
        return res.status(401).send(error);
      }
    } catch (error) {
      // Access Denied
      return res.status(401).send(error);
      //return res.status(403).json({ message: "Failed to authenticate token." });
    }
  }
);

// Refresh token - in use
router.post("/refresh", cors(), async (req, res) => {
  const { email, refresh_token } = req.body;
  const userExist = await User.findOne({ email: email });

  const isValid = refreshToken(email, refresh_token);
  if (!isValid) {
    return res.status(401).json({
      status: 401,
      error: "Refresh token has expired,try login again.",
    });
    // TODO ----- Add code here to auto logout user
  }

  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  let data = {
    time: Date(),
    user_id: userExist.user_id,
    email: req.body.email,
    password: userExist.password,
    user_role: userExist.user_role,
  };

  const access_token = jwt.sign(data, jwtSecretKey, {
    expiresIn: "1800s",
  });
  return res.status(200).json({ status: 200, access_token });
});
module.exports = router;