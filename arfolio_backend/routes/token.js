const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { refreshToken } = require("../middleware/auth");

const app = express();
var cors = require("cors");
const router = express.Router();

const User = require("../models/user.models");
const Login = require("../models/login.models");

const accessToken_expiresIn = '60s'; //1800s = 30 mins
const accessToken_expires_in = "60 seconds"

const refreshToken_expiresIn = '180s'; 
const refreshToken_expires_in = "180 seconds"

// Generate Token - test
router.post("/generateToken", cors(), async (req, res) => {
  try{
    // Validate User Here - if a user exists in the db with the given credentials
    console.log(req.body.email);

    const userExist = await User.findOne({ email: req.body.email });
    const userAlreadyLogged = await Login.findOne({ email: req.body.email });

    if (userExist && userAlreadyLogged) {
        // Then generate JWT Token
        let jwtSecretKey = process.env.JWT_SECRET_KEY;

        // const salt = await bcrypt.genSalt(10);
        // hashedPassword = await bcrypt.hash(req.body.password, salt);

        const validPassword = await bcrypt.compare(
          req.body.password,
          userExist.password
        );
    
        if (!validPassword)
          return res
            .status(400)
            .send({ status: 400, message: "Invalid password." });

        let data = {
          time: Date(),
          user_id: userExist.user_id,
          email: req.body.email,
          password: userExist.password,
          user_role: userExist.user_role,
          expires_in: accessToken_expiresIn,
        };

        const token = jwt.sign(data, jwtSecretKey, {expiresIn: accessToken_expiresIn});

        // Format the token as a Bearer token
        const bearerToken = `Bearer ${token}`;

        // Prepare the response data with additional details
        let response = {
          user_id: userExist.user_id,
          user_role: userExist.user_role,
          token_type: userExist.token_type,
          token: bearerToken,
          expires_in: accessToken_expires_in, 
        };

        //res.send(bearerToken);
        // return res.json({ token: bearerToken });
        return res.json(response);
    
      } else if (!userAlreadyLogged) {
        return res
        .status(400)
        .send({ status: 400, message: "User not logged in." });
      } else {
        return res
          .status(400)
          .send({ status: 400, message: "User not found." });
      }
  } catch (err) {
    return res.status(402).send({ status: 402, message: err.message });
  }
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
  try {
    const { email, refresh_token } = req.body;
    const userExist = await User.findOne({ email: email });

    const isValid = refreshToken(email, refresh_token);
    if (!isValid) {
      return res.status(401).json({
        status: 401,
        error: "Invalid refresh token.",
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
      expires_in: accessToken_expires_in,
    };

    const access_token = jwt.sign(data, jwtSecretKey, {
      // expiresIn: expiresIn,
      expiresIn: accessToken_expiresIn,
    });

    // Prepare the response data with additional details
    let response = {
      user_id: userExist.user_id,
      user_role: userExist.user_role,
      token_type: "Bearer",
      access_token: access_token,
      expires_in: accessToken_expires_in, 
    };

    return res.status(200).json({ status: 200, response });
  } catch (err) {
    return res.status(403).send({ status: 403, message: err.message });
  }
});
module.exports = router;