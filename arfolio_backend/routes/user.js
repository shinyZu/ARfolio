const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  authenticateAdminToken,
  authenticateCustomerToken,
} = require("../middleware/auth");

const crypto = require("crypto");
const sharp = require("sharp");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  UploadPartOutputFilterSensitiveLog,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require("dotenv").config();

const app = express();
const cors = require("cors");
const router = express.Router();

const User = require("../models/user.models");
const Education = require("../models/education.models");
const Experience = require("../models/experience.models");
const Project = require("../models/project.models");
const LinkHub = require("../models/linkhub.models");
const upload = require("../middleware/upload");

// -------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const {
  googleUpload,
  uploadFile,
  deleteFile,
  generatePublicURL,
} = require("../middleware/google_router"); // YT

const drive_base_url = "https://drive.google.com/uc";

const {generateNextEducationId} = require("../routes/education");
const {generateNextExperienceId} = require("../routes/experience");
const {generateNextProjectId} = require("../routes/project");
const {generateNextLinkHubId} = require("../routes/linkhub");

// -----------S3 related variables ------------------

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

// -------------Generate Random Unique Image Name---------------------

const randomImageName = (bytes = 16) =>
  crypto.randomBytes(bytes).toString("hex");

// ------------------------------------------------------

const login = require("./login");

// ------------------------------------------------------

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
router.get("/admin/:user_id", cors(), /* authenticateAdminToken, */ async (req, res) => {
  try {
    const user = await getAllDetails(req.params.user_id,res);

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
router.get("/:user_id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const user = await getAllDetails(req.params.user_id,res);

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

// Update only User (no image) - in use
// Authorized only for Customers to get their own details
router.put("/:user_id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ user_id: req.params.user_id });

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

    const userInfo = await getAllDetails(req.params.id,res);

    return res.send({
      status: 200,
      user: userInfo,
      message: "User updated successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ status: 400, message: err.message });
  }
});

// Delete Customer Account
// Authorized only for Customers to delete their own account
router.delete("/:user_id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const userExist = await User.findOne({
      user_id: req.params.user_id,
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

//----------------------------------------------

// Get Image By Id - in use
router.get("/image/:user_id", cors(), /* authenticateCustomerToken, */ async (req, res) => {
  try {
    const userExist = await checkUserExist(req.params.user_id, res);

    const users = await User.find();
    
    for (const user of users) {
      if (user.user_id == req.params.user_id) {
        console.log(user)
        return res.send({
          status: 200,
          user_id: user.user_id,
          image_url: user.image_url,
        });
      }
    }
  } catch (err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
});

// --------------Upload images using Google Drive API -------------

// Get all images
router.get("/images/all", cors(), async (req, res) => {
  try {
    const users = await User.find();

    console.log(users)

    const imagesList = [];
    for (const user of users) {
      imagesList.push({ user_id: user.user_id, image_url: user.image_url });
    }
    return res.send({
      status: 200,
      images: imagesList,
    });
  } catch (err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
});

// Save image to drive - working
router.post(
  "/drive/upload",
  cors(),
  googleUpload.single("user_image"),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const { body, file } = req;

      // Upload file to drive
      const response = await uploadFile(file);

      res.send({
        status: 201,
        message: "File uploaded successfully!",
        data: {
          file_id: response.data.id,
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error.message);
      return res.status(500).send({ status: 500, message: error.message });
    }
  }
);

// Save user to database (with image url) - post(/drive/url/prod) - working
router.post(
  "/drive/url/prod",
  cors(),
  googleUpload.single("user_image"),
  async (req, res) => {
    try {
      const { body, file } = req;

      // Check if user already exists
      const userExist = await User.findOne({
        email: body.email,
      });
      if (userExist) {
        return res
          .status(400)
          .json({ status: 400, message: "User already exists." });
      }

      // Upload file to drive
      const response = await uploadFile(file);

      const fileId = response.data.id;
      const imageName = file.originalname;

      if (!fileId) {
        return res
          .status(404)
          .send({ status: 404, message: "File not found." });
      }

      // Generate public image URL & save the user to DB
      saveUserToDB(body, res, imageName, fileId);
    } catch (error) {
      console.error("Error uploading file:", error.message);
      return res.status(500).send({ status: 500, message: error.message });
    }
  }
);

const saveUserToDB = async (body, res, imageName, fileId) => {
  try {
    // Check if user already exists
    const userExist = await User.findOne({ email: body.email });
    if (userExist) {
      return res
        .status(400)
        .json({ status: 400, message: "User already exists." });
    }

    // Get the last inserted user_id from the database
    const lastId = await User.findOne(
      {},
      {},
      { sort: { user_id: -1 } }
    );
    let nextId = 1;

    if (lastId) {
      nextId = lastId.user_id + 1;
    }

    // Create image url
    const public_image_url = `${drive_base_url}?id=${fileId}`;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create a new user instance
    const newUser = new User({
      user_id: nextId,
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
      image_name: imageName,
      image_url: public_image_url,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).send({
      status: 201,
      data: newUser,
      message: "User created successfully!",
    });
  } catch (err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
};

// Update image url in db (updateImageInfo) - for testing - working
router.put(
  "/image/details/:user_id",
  cors(),
  // upload.single("product_image"),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExsit = await checkUserExist(req.params.user_id, res);
      const body = req.body;

      // Update the stationery in the database
      userExsit.image_name = body.image_name;
      userExsit.image_url = body.image_url;

      const updatedUser = await userExsit.save();
      return res.send({
        status: 200,
        user: updatedUser,
        message: "Image details updated successfully!",
      });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

// Upload Image only - post(/drive/url/db) - in use
router.put(
  "/drive/url/db/:user_id",
  cors(),
  upload.single("user_image"),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExist = await checkUserExist(req.params.user_id);
      if (!userExist) {
        return res
          .status(404)
          .json({ status: 404, message: "User not found." });
      }

      console.log(req)
      // console.log(req.file)


      // resize image
      const buffer = await sharp(req.file.buffer)
        .resize({ height: 1920, width: 1080, fit: "contain" })
        .toBuffer();

      // Get current image url
      const current_url = userExist.image_url;
      console.log("current_url: " + current_url);

      let current_fileId = "";

      // Upload new image
      const upload_response = await uploadFile(req.file);

      const new_fileId = upload_response.data.id;
      const new_imageName = req.file.originalname;

      // Create new image url
      const new_public_image_url = `${drive_base_url}?id=${new_fileId}`;
      console.log("new_public_image_url: " + new_public_image_url);

      // Update the user in the database
      userExist.image_name = new_imageName;
      userExist.image_url = new_public_image_url;

      const updatedUser = await userExist.save();

      let del_response = null;
      if (current_url != "" /* && userExist.image_url != "" */) {
        // Extract the current file id from the url
        current_fileId = current_url.split("id=")[1];
        console.log("current_fileId: " + current_fileId);

        // Delete current image from drive
        del_response = await deleteFile(current_fileId);

        if (!del_response && del_response.status == 204) {
          return res.status(200).send({
            status: 200,
            data: {
              file_id: upload_response.data.id,
            },
            message: "Image updated successfully!",
          });
        }
      } else if (current_url == "") {
        return res.status(200).send({
          status: 200,
          data: {
            file_id: upload_response.data.id,
          },
          message: "Image updated successfully!",
        });
      }
      // else {
      return res.status(200).send({
        status: 200,
        data: {
          file_id: upload_response.data.id,
        },
        message: "Image updated successfully!",
      });
      // }
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

// Delete image from Google Drive - Customer
router.delete(
  "/drive/image/:id",
  cors(),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const fileId = req.params.id;

      const response = await deleteFile(fileId);

      return res.send({
        status: 200,
        message: "File deleted successfully!",
        data: {
          status: response.status,
          data: response.data,
        },
        // data: response,
      });
    } catch (error) {
      console.error("Error deleting file:", error.message);
      return res.status(500).send({ status: 500, message: error.message });
    }
  }
);

// Delete User (with image in drive)- Customer - in use
router.delete(
  "/drive/:user_id",
  cors(),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExist = await checkUserExist(req.params.user_id, res);

      if (!userExist) {
        return res
          .status(404)
          .send({ status: 404, message: "User not found." });
      }

      // Get current image url
      const current_url = userExist.image_url;
      console.log(current_url);

      // Extract the current file id from the url
      const current_fileId = current_url.split("id=")[1];
      console.log(current_fileId);

      // delete image from drive
      const response = await deleteFile(current_fileId);

      // delete image from DB
      let deletedUser = await User.deleteOne(userExist);

      return res.status(200).send({
        status: 200,
        message: "User deleted successfully!",
        data: deletedUser,
      });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

// Delete User (without image) - Customer
router.delete("/only/:user_id", cors(), authenticateCustomerToken, async (req, res) => {
  try {
    const userExist = await checkUserExist(req.params.user_id, res);

    if (!userExist) {
      return res
        .status(404)
        .send({ status: 404, message: "User not found." });
    }

    // delete image from DB
    let deletedUser = await Stationery.deleteOne(userExist);

    return res.send({
      status: 200,
      message: "User deleted successfully!",
      data: deletedUser,
    });
  } catch (err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
});

// Generate public URL for drive
router.get("/generate/public/url/:id", async (req, res) => {
  try {
    const fileId = req.params.id;

    const response = await generatePublicURL(fileId);

    return res.send({
      status: 200,
      message: "Public URL generated successfully!",
      data: {
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webViewLink,
      },
      data: response,
    });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    return res.status(500).send({ status: 500, message: error.message });
    // res.status(500).send("Error deleting file");
  }
});

// ------------------- Video Upload -----------------

// Get Video By Id - in use
router.get("/video/:user_id", cors(), /* authenticateCustomerToken, */ async (req, res) => {
  try {
    const userExist = await checkUserExist(req.params.user_id, res);

    const users = await User.find();
    
    for (const user of users) {
      if (user.user_id == req.params.user_id) {
        console.log(user)
        return res.send({
          status: 200,
          user_id: user.user_id,
          video_url: user.video_url,
        });
      }
    }
  } catch (err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
});

// testing API
router.put('/upload/video', upload.single('user_video'), (req, res) => {
  try {
    // You can access the file using req.file
    console.log(req.file);
    res.send('Video uploaded successfully');
  } catch (error) {
    res.status(400).send('Error uploading video');
  }
});

// Upload Video only - post(/drive/url/db/video) - in use
router.put(
  "/drive/url/db/video/:user_id",
  cors(),
  upload.single("user_video"),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExist = await checkUserExist(req.params.user_id);
      if (!userExist) {
        return res
          .status(404)
          .json({ status: 404, message: "User not found." });
      }

      console.log(req.file)

      // resize image
      

      // Get current video url
      const current_url = userExist.video_url;
      console.log("current_url: " + current_url);
     
      let current_fileId = "";

      // Upload new video
      const upload_response = await uploadFile(req.file);
      console.log("\nupload_response: " + upload_response);

      const new_fileId = upload_response.data.id;
      const new_videoName = req.file.originalname;

      // Create new video url
      const new_public_video_url = `${drive_base_url}?id=${new_fileId}`;
      console.log("new_public_video_url: " + new_public_video_url);

      // Update the user in the database
      userExist.video_name = new_videoName;
      userExist.video_url = new_public_video_url;

      const updatedUser = await userExist.save();

      let del_response = null;
      if (current_url != "" /* && userExist.image_url != "" */) {
        // Extract the current file id from the url
        current_fileId = current_url.split("id=")[1];
        console.log("current_fileId: " + current_fileId);

        // Delete current video from drive
        del_response = await deleteFile(current_fileId);

        if (!del_response && del_response.status == 204) {
          return res.status(200).send({
            status: 200,
            data: {
              file_id: upload_response.data.id,
            },
            message: "Video updated successfully!",
          });
        }
      } else if (current_url == "") {
        return res.status(200).send({
          status: 200,
          data: {
            file_id: upload_response.data.id,
          },
          message: "Video updated successfully!",
        });
      }
      // else {
      return res.status(200).send({
        status: 200,
        data: {
          file_id: upload_response.data.id,
        },
        message: "Video updated successfully!",
      });
      // }
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

// Update video url in db (updateVideoInfo) - for testing - working
router.put(
  "/video/details/:user_id",
  cors(),
  // upload.single("product_image"),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExsit = await checkUserExist(req.params.user_id, res);
      const body = req.body;

      // Update the stationery in the database
      userExsit.video_name = body.video_url;
      userExsit.video_url = body.video_url;

      const updatedUser = await userExsit.save();
      return res.send({
        status: 200,
        user: updatedUser,
        message: "Video details updated successfully!",
      });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

// Delete video from Google Drive - Customer
router.delete(
  "/drive/video/:id",
  cors(),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const fileId = req.params.id;

      const response = await deleteFile(fileId);

      return res.send({
        status: 200,
        message: "File deleted successfully!",
        data: {
          status: response.status,
          data: response.data,
        },
        // data: response,
      });
    } catch (error) {
      console.error("Error deleting file:", error.message);
      return res.status(500).send({ status: 500, message: error.message });
    }
  }
);

const checkUserExist = async (id, res) => {
  const userExist = await User.findOne({
    user_id: id,
  });

  if (!userExist) {
    return null;
  } else {
    return userExist;
  }
};

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


// --------------Upload images using S3 Buckets -------------

// Upload Image only - S3
router.put(
  "/image/:user_id",
  cors(),
  upload.single("user_image"),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExist = await checkUserExist(req.params.user_id);
      if (!userExist) {
        return res
          .status(404)
          .json({ status: 404, message: "User not found." });
      }

      console.log(req)

      if(userExist.image_name != null || userExist.image_name != ""){
        deleteImage(userExist.image_name);
      }

      // resize image
      const buffer = await sharp(req.file.buffer)
        .resize({ height: 1920, width: 1080, fit: "contain" })
        .toBuffer();

      // create put command
      const put_params = {
        Bucket: bucketName,
        Key: `Images/${randomImageName()}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const put_command = new PutObjectCommand(put_params);

      // Send the image to S3 bucket & save
      await s3.send(put_command);

      // Create image url
      const getObjectParams = {
        Bucket: bucketName,
        Key: put_params.Key,
      };
      const get_command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, get_command, { expiresIn: 172800 }); // 2 days

      // Update the user in the database
      userExist.image_name = put_params.Key;
      userExist.image_url = url;

      const updatedUser = await userExist.save();

      return res.send({
        status: 200,
        data: updatedUser,
        message: "Image updated successfully!",
      });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

// Delete Image from s3
router.delete(
  "/image/:id",
  cors(),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExist = await checkUserExist(req.params.id, res);
      console.log(userExist)

      // delete image from s3 bucket
      deleteImage(userExist.image_name);

      // Update the user in the database
      userExist.image_name = null;
      userExist.image_url = null;

      const updatedUser = await userExist.save();
      return res.send({
        status: 200,
        data: updatedUser,
        message: "Image deleted successfully!",
      });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

const deleteImage = async (imageName) => {
  // delete image from s3 bucket
  if (imageName) {

    const delete_params = {
      Bucket: bucketName,
      Key: imageName,
    };
    
    const delete_command = new DeleteObjectCommand(delete_params);
    await s3.send(delete_command);
  }
};

// Upload Video only - S3
router.put(
  "/video/:user_id",
  cors(),
  upload.single("user_video"),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExist = await checkUserExist(req.params.user_id);
      if (!userExist) {
        return res
          .status(404)
          .json({ status: 404, message: "User not found." });
      }

      // console.log(req)

      if(userExist.video_name != null || userExist.video_name != ""){
        deleteVideo(userExist.video_name);
      }

      // create put command
      const put_params = {
        Bucket: bucketName,
        Key: `Videos/${randomImageName()}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const put_command = new PutObjectCommand(put_params);

      // Send the image to S3 bucket & save
      await s3.send(put_command);

      // Create image url
      const getObjectParams = {
        Bucket: bucketName,
        Key: put_params.Key,
      };
      const get_command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, get_command, { expiresIn: 172800 });

      // Update the user in the database
      userExist.video_name = put_params.Key;
      userExist.video_url = url;

      const updatedUser = await userExist.save();

      return res.send({
        status: 200,
        data: updatedUser,
        message: "Video updated successfully!",
      });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

// Delete Video from s3
router.delete(
  "/video/:id",
  cors(),
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const userExist = await checkUserExist(req.params.id, res);
      console.log(userExist)

      // delete image from s3 bucket
      deleteVideo(userExist.video_name);

      // Update the user in the database
      userExist.video_name = null;
      userExist.video_url = null;

      const updatedUser = await userExist.save();
      return res.send({
        status: 200,
        data: updatedUser,
        message: "Video deleted successfully!",
      });
    } catch (err) {
      return res.status(400).send({ status: 400, message: err.message });
    }
  }
);

const deleteVideo = async (videoName) => {
  if(videoName) {
    // delete image from s3 bucket
    const delete_params = {
      Bucket: bucketName,
      Key: videoName,
    };
    
    const delete_command = new DeleteObjectCommand(delete_params);
    await s3.send(delete_command);
  }
};

module.exports = router;