import React, { useState, useEffect, useRef } from "react";
import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";
import QRCodeStyling from "qr-code-styling";
import QRCode from "easyqrcodejs";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Header from "../../components/Header/Header";
import MyButton from "../../components/common/MyButton/MyButton";
import Footer from "../../components/Footer/Footer";
import MySnackBar from "../../components/common/MySnackBar/MySnackbar";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";

import qr_code from "../../assets/images/Portfolio/qr-code-with-barcode.png"

import {jwtDecode} from "jwt-decode";

import QRService from "../../services/QRService";

const Process = (props) => {
  const { classes} = props;

    const canvasRef = useRef(null);

    // Alerts & Confirmation dialog boxes
    const [openAlert, setOpenAlert] = useState({
        open: "",
        alert: "",
        severity: "",
        variant: "",
    });
    
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
        confirmBtnStyle: {},
        action: "",
    });

    useEffect(()=>{
      generateQR();
      // createQR();
    },[]);

    // Function to decode the JWT token
    const decodeToken = () => {
      try {
          const token = localStorage.getItem("token");
          const decodedToken = jwtDecode(token);
          console.log(decodedToken);
          return decodedToken;
      } catch (error) {
          console.error("Error decoding JWT token:", error);
          return null;
      }
    };

    const generateBase64 = async () => {
      let decodedToken = decodeToken();
      let res = await QRService.generateBase64(decodedToken.user_id);

      if (res.status === 200) {
        console.log(res.data.data);

        return res.data.data;
      }
    }

    const generateQR = async () => {
      let base64 = await generateBase64();

      if (canvasRef.current) { 

        let canvasList = canvasRef.current.querySelectorAll('canvas');
        console.log(canvasList)

        if (canvasList.length > 0) {
          canvasList.forEach(canvas => {
            canvas.parentNode.removeChild(canvas);
          });
        }

        console.log(canvasRef.current)

        let options = {
          width: 490,
          height: 490,
          data: "https://qr-code-styling.com",
          margin: 2,
          qrOptions: {
            typeNumber: "0",
            mode: "Byte",
            errorCorrectionLevel: "H"
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 1,
            margin: 5
          },
          dotsOptions: {
            type: "dots",
            color: "#000000"
          },
          backgroundOptions: {
            color: "#ffffff"
          },
          image: base64,
          dotsOptionsHelper: {
            colorType: {
              single: true,
              gradient: false
            },
            gradient: {
              linear: true,
              radial: false,
              color1: "#6a1a4c",
              color2: "#6a1a4c",
              rotation: "0"
            }
          },
          cornersSquareOptions: {
            type: "square",
            color: "#000000"
          },
          cornersSquareOptionsHelper: {
            colorType: {
              single: true,
              gradient: false
            },
            gradient: {
              linear: true,
              radial: false,
              color1: "#000000",
              color2: "#000000",
              rotation: "0"
            }
          },
          cornersDotOptions: {
            type: "square",
            color: "#000000"
          },
          cornersDotOptionsHelper: {
            colorType: {
              single: true,
              gradient: false
            },
            gradient: {
              linear: true,
              radial: false,
              color1: "#000000",
              color2: "#000000",
              rotation: "0"
            }
          },
          backgroundOptionsHelper: {
            colorType: {
              single: true,
              gradient: false
            },
            gradient: {
              linear: true,
              radial: false,
              color1: "#ffffff",
              color2: "#ffffff",
              rotation: "0"
            }
          }
        }

        const newQRCode = new QRCodeStyling(options);

        // Append the QR code to the referenced div
        if (canvasRef.current) {
            newQRCode.append(canvasRef.current);
        }

        console.log(canvasRef.current)
      }
    }

    const downloadQRcode = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current.querySelector('canvas');
        console.log(canvas)
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = image;
        link.click();
      }
    }

    // testing easyqrcode.js - npm
    const createQR = () => {
      try {
          let barcodeLogoURL = generateBarcodeURL(3);
          console.log(barcodeLogoURL);

          // Options
          let options = {
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
            // logo:barcodeLogoURL,
            logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
            // logo: "../../assets/images/Portfolio/qr-code-with-barcode.png",
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

            // ==== CORS ==========
            // crossOrigin: "anonymous",
        
          };

          if (canvasRef.current) { 

            let canvasList = canvasRef.current.querySelectorAll('canvas');
            console.log(canvasList)
    
            if (canvasList.length > 0) {
              canvasList.forEach(canvas => {
                canvas.parentNode.removeChild(canvas);
              });
            }
    
            console.log(canvasRef.current)
    
            var qrcode = new QRCode(canvasRef.current, options);
          }

      } catch (error) {
          console.error("Error loading logo image:", error);
      }
    }

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

  return (
    <div >
      <Header />

      <Box sx={{ flexGrow: 1 }} className={classes.box_container}>
        <Grid
            container
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className={classes.main_container}
            display="flex"
            justifyContent="center"
        >
             <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.title_container}
                display="flex"
                justifyContent="center"
            >
                <Typography variant="h3" className={classes.txt_title}>
                    Your AR-enabled Portfolio Card has been generated successfully..!
                </Typography>
            </Grid>

            <Grid
                item
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                display="flex"
                justifyContent="center"
                style={{marginTop:"4vh",}}

            >
                <div ref={canvasRef} className={classes.qr_container} ></div>
                
            </Grid>
            
            <Grid
                item
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                display="flex"
                justifyContent="center"
                style={{marginTop:"4vh"}}
            >
               <MyButton
                    id="qrcode_download"
                    label="Download QR Code"
                    size="small"
                    variant="outlined"
                    type="button"
                    style={{ width: "20%", height: "100%" }}
                    className={classes.btn_download}
                    onClick={() => {downloadQRcode()}}
                />
            </Grid>

            <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.title_container}
                display="flex"
                justifyContent="center"
            >
                <Typography variant="h6" className={classes.txt_qr_description}>
                    Use this QR code to launch the AR application.<br></br>
                    You can also use this same QR code to experience your the AR-enabled Portfolio. 
                </Typography>
            </Grid>
        </Grid>
      </Box>

      {/* ------------- Footer -------------- */}
      <Footer />

      <MySnackBar
        open={openAlert.open}
        alert={openAlert.alert}
        severity={openAlert.severity}
        variant={openAlert.variant}
        onClose={() => {
          setOpenAlert({ open: false });
        }}
      />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

    </div>
  );
};

export default withStyles(styleSheet)(Process);
