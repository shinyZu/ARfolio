// YT

const stream = require("stream");
const express = require("express");
const path = require("path");
const fs = require("fs");

const multer = require("multer");
const { google } = require("googleapis");

// const uploadRouter = express.Router();
const googleUpload = multer();

const KEYFILEPATH = path.join(__dirname, "../credentials.json"); //https://drive.google.com/file/d/1-98h8KK4zJJ1j7c6ONdIgOi5Czh1lnF_/view?usp=drive_link
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

const uploadFile = async (fileObject) => {
  console.log(fileObject);
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  const requestBody = {
    name: fileObject.originalname,
    parents: ["1QelId2CrTGvfVWR13mEym7KflAu9p4xD"], // drive folder id
  };

  const media = {
    mimeType: fileObject.mimetype,
    body: bufferStream,
    // body: fs.createReadStream(KEYFILEPATH),
  };

  const response = await drive.files.create({
    media: media,
    resource: requestBody,
    fields: "id, name",
  });

  return response;
};

//
const deleteFile = async (fileId) => {
  const del_response = await drive.files.delete({
    fileId: fileId,
  });

  //   console.log(del_response);
  return del_response;
};

// Create public URL for files
const generatePublicURL = async (fileId) => {
  // create permissions
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // generate URL
  const result = await drive.files.get({
    fileId: fileId,
    fields: ["webViewLink", "webContentLink"],
  });

  console.log(result);

  return result;
};

module.exports = { googleUpload, uploadFile, deleteFile, generatePublicURL };