const multer = require("multer");

const storage = multer.memoryStorage();
// Set multer storage engine to the newly created object
const upload = multer({ storage: storage });

module.exports = upload;