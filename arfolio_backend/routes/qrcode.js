const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { refreshToken } = require("../middleware/auth");

const app = express();
var cors = require("cors");
const router = express.Router();

// const QRCode = require("qrcode-with-logos");
// const QRCode = require("qrcode");
// const QRCode = require("qr-code-styling");
// const QRCode = require('easyqrcodejs-nodejs');

const Jimp = require("jimp");
const fetch = require("node-fetch");
const sharp = require('sharp');
const User = require("../models/user.models");
const Login = require("../models/login.models");


// convert image URL to Base64 code
router.get('/generate/base64', async (req, res) => {
    // const imageUrl = req.query.url;
    
    const user_id = req.query.user_id;
    let barcodeLogoURL = generateBarcodeURL(user_id);

    const imageResponse = await fetch(barcodeLogoURL);
    const imageBlob = await imageResponse.blob();

    imageBlob.arrayBuffer().then(buffer => {
      const base64Flag = 'data:image/jpeg;base64,';
      const imageStr = base64Flag + Buffer.from(buffer).toString('base64');

      return res
            .status(200)
            .send({ status: 200, message: "Base64 generated successfully!", data: imageStr });
    });
});

const generateBarcodeURL = (user_id) => {
    const baseUrl = "https://au.gmented.com/app/marker/marker.php?genImage&";

    const options = {
        marker_type : "matrix",
        gen_single_number : user_id,
        marker_size : 80,
        marker_image_resolution : 300,
        ecc_type : "none",
        border_size : 0.25,
        border_is_white : false,
        border_quiet_zone : false,
        barcode_dimensions : 3
    };

    // Construct query parameters from options
    const queryParams = new URLSearchParams(options).toString();

    // Return the full URL
    return `${baseUrl}${queryParams}`;
}

// ========================== Testing APIs ========================================

// testing
router.post("/generate/barcode", cors(), async (req, res) => {
    console.log("generating QR code");

    let barcodeLogoURL = generateBarcodeURL(3);

    return res
            .status(200)
            .send({ status: 200, message: "Barcode generated successfully", Barcode: barcodeLogoURL });
});

// testing - using sharp
router.post("/generateQR/sharp", cors(), async (req, res) => {
    console.log("generating QR code");

    let barcodeLogoURL = generateBarcodeURL(3);

    const text = 'https://github.com/shinyZu/SchoolMart/tree/master';
    const qrOptions = {
        errorCorrectionLevel: 'H', // High error correction level
        scale: 10, // Increase scale for higher resolution
        margin: 2, // Margin around the QR code
    };
    const logoPath = "barcode-1.png"; // Path to your logo image
    const outputPath = 'sharp-qrcode.png'; // Where to save the final image

    let  QRBuffer = generateQRCode(text, qrOptions)
        .then((qrBuffer) => overlayLogo(qrBuffer, logoPath, outputPath))
        .catch(console.error);

    return res
            .status(200)
            .send({ status: 200, message: "QR generated successfully", QR: QRBuffer });
});

// testing - QR as Base64 - qrcode npm
router.post("/gpt4/generateQR", cors(), async (req, res) => {
    console.log("generating QR code as per GPT 4");

    let barcodeLogoURL = generateBarcodeURL(1);

    try {
        // Generate QR code as image
        const qrImage = await QRCode.toDataURL("https://github.com/shinyZu/SchoolMart/tree/master", { errorCorrectionLevel: 'H'/* , version:3, scale:8, width:100 */ });

        // Fetch the logo image
        const logoImage = await fetchImageAsJimp(barcodeLogoURL);

        // Read the QR code image
        const qrJimpImage = await Jimp.read(Buffer.from(qrImage.split(",")[1], 'base64'));

        // Resize logo
        logoImage.resize(50, 50); // Adjust size as needed

        // Calculate position for logo on QR code
        const x = Math.floor((qrJimpImage.bitmap.width - logoImage.bitmap.width) / 2);
        const y = Math.floor((qrJimpImage.bitmap.height - logoImage.bitmap.height) / 2);

        // Assuming logoImage is your Jimp image object for the logo
        // Adjust the contrast; values range from -1 to +1, where 0 is no change
        // logoImage.contrast(0.7); // Increase contrast; adjust the value as needed

        // logoImage.convolute([
        //     [0, -1, 0],
        //     [-1, 5, 1],
        //     [0, -1, 0],
        // ]);

        // Composite logo over QR code
        qrJimpImage.composite(logoImage, x, y, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 0.5,
            opacitySource: 1
        });

        // Convert to Base64 and send to client
        qrJimpImage.getBase64(Jimp.MIME_JPEG, (err, result) => {
            if (err) {
                console.error("Error generating QR Code:", err);
                return res.status(500).send({ status: 500, message: "Error generating QR code" });
            }
            console.log("QR Code generated successfully.");
            return res.status(200).send({ status: 200, message: "QR Code generated successfully", qrcode: result });
        });
    } catch (err) {
        console.error("Error generating QR Code:", err);
        return res.status(500).send({ status: 500, message: "Error generating QR code" });
    }
});

// testing - easyqrcodejs-nodejs
router.post("/generate/easy", cors(), async (req, res) => {
    console.log("generating QR code using easyqrcodejs-nodejs");

    let barcodeLogoURL = generateBarcodeURL(3);

    // Options
    var options = {
        // ====== Basic ========
        text: "https://github.com/shinyZu/SchoolMart/tree/master",
        width: 360,
        // height: 256,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H, // L, M, Q, H

        // ====== Dot Scale ========
        dotScale: 0.5, // For body block, must be greater than 0, less than or equal to 1. default is 1

        dotScaleTiming: 0.5, // Dafault for timing block , must be greater than 0, less than or equal to 1. default is 1
        // dotScaleTiming_H: 0.5, // For horizontal timing block, must be greater than 0, less than or equal to 1. default is 1
        // dotScaleTiming_V: 0.5, // For vertical timing block, must be greater than 0, less than or equal to 1. default is 1

        dotScaleA: 0.5, // Dafault for alignment block, must be greater than 0, less than or equal to 1. default is 1
        // dotScaleAO: 0.5, // For alignment outer block, must be greater than 0, less than or equal to 1. default is 1
        // dotScaleAI: 0.5, // For alignment inner block, must be greater than 0, less than or equal to 1. default is 1

        // ====== Quiet Zone ========
        quietZone: 10,
        quietZoneColor: "rgba(255,255,255,255)",

        // ====== Logo ========
        // logo: "../demo/logo.png", // Relative address, relative to `easy.qrcode.min.js`
        logo: barcodeLogoURL, 
        logoWidth: 100, // fixed logo width. default is `width/3.5`
        logoHeight: 100, // fixed logo height. default is `heigth/3.5`
        // logoMaxWidth: undefined, // Maximum logo width. if set will ignore `logoWidth` value
        // logoMaxHeight: undefined, // Maximum logo height. if set will ignore `logoHeight` value
        logoBackgroundColor: '#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
        logoBackgroundTransparent: false, // Whether use transparent image, default is false

        // ====== Backgroud Image =========    
        // backgroundImage: '', // Background Image
        // backgroundImageAlpha: 1, // Background image transparency, value between 0 and 1. default is 1. 
        // autoColor: false, // Automatic color adjustment(for data block)
        // autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
        // autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color

        // ====== Colorful Posotion Pattern(Eye) Color ========
        PO: '', // Global Posotion Outer color. if not set, the defaut is `colorDark`
        PI: '', // Global Posotion Inner color. if not set, the defaut is `colorDark`
        PO_TL:'', // Posotion Outer color - Top Left 
        PI_TL:'', // Posotion Inner color - Top Left 
        PO_TR:'', // Posotion Outer color - Top Right 
        PI_TR:'', // Posotion Inner color - Top Right 
        PO_BL:'', // Posotion Outer color - Bottom Left 
        PI_BL:'', // Posotion Inner color - Bottom Left 

        // === Alignment Color =============
        AO: '', // Alignment Outer. if not set, the defaut is `colorDark`
        AI: '', // Alignment Inner. if not set, the defaut is `colorDark`
        
        // === Timing Pattern Color ========
        timing: '', // Global Timing color. if not set, the defaut is `colorDark`
        timing_H: '', // Horizontal timing color
        timing_V: '', // Vertical timing color

        // ==== Images format ======
        format: 'JPG', // 'PNG', 'JPG'
        compressionLevel: 6, // ZLIB compression level (0-9). default is 6
        quality: 0.75, // An object specifying the quality (0 to 1). default is 0.75. (JPGs only) 
    
    };

    // New instance with options
    var qrcode = new QRCode(options);

    // Save QRCode image
    // qrcode.saveImage({
    //     path: 'q.png' // save path
    // });

    return res
            .status(200)
            .send({ status: 200, message: "qrcode generated successfully", qrcode: qrcode });
});

const fetchImageAsJimp = async (url) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    // return await Jimp.read(buffer);
    return await Jimp.read(buffer)
    // .then((b)=>{
    //     return b
    //     .resize(1000, 1000) // resize
    //     .quality(100) // set JPEG quality
    //     .greyscale() // set greyscale
    //     .write("lena-small-bw.jpg"); // save
    // });
};

// Function to generate QR code as a buffer
const generateQRCode = async (text, options) => {
    try {
      const qrBuffer = await QRCode.toBuffer(text, options);
      return qrBuffer;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
};

// Function to overlay logo on QR code
const overlayLogo = async (qrBuffer, logoPath, outputPath) => {
    try {
      // Load the logo and the QR code images
      const logo = await sharp(logoPath).resize(150, 150).toBuffer(); // Resize logo to fit the QR code
      const qrImage = await sharp(qrBuffer)
        .composite([{ input: logo, gravity: 'centre' }]) // Overlay the logo at the center
        .toBuffer();
  
      // Save the final image
      await sharp(qrImage).toFile(outputPath);
      console.log('QR code with logo saved to', outputPath);
    } catch (error) {
      console.error('Error overlaying logo on QR code:', error);
      throw error;
    }
};

module.exports = router;