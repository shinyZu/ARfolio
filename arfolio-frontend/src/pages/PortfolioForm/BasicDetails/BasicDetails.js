import React, { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { blue } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import Header from "../../../components/Header/Header";
import MyTextField from "../../../components/common/MyTextField/MyTextField";
import MyButton from "../../../components/common/MyButton/MyButton";
import Footer from "../../../components/Footer/Footer";
import MySnackBar from "../../../components/common/MySnackBar/MySnackbar";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import FileChooser from "../../../components/common/FileChooser/FileChooser";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import {jwtDecode} from "jwt-decode";

// import upload_bg from "../../../assets/images/Portfolio/choose_image.jpg";
import upload_bg from "../../../assets/images/Portfolio/add_image_2_rz.jpg";
import upload_video_bg from "../../../assets/images/Portfolio/add_video_3_rz.jpg";

import UserService from "../../../services/UserService";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const BasicDetails = (props) => {
  const { classes } = props;
  const navigate = useNavigate();

  const location = useLocation();
  console.log(location)

  const [gender, setGender] = useState("Male");

  const [mediaImage, setMediaImage] = useState(upload_bg);
  const [mediaVideo, setMediaVideo] = useState(null);
  const [mediaVideoForIframe, setMediaVideoForIframe] = useState(null);

  const iframeRef = useRef(null);
  const [contentStatus, setContentStatus] = useState('loading'); // 'loading', 'loaded', 'error'


  const [basicInfoForm, setBasicInfoForm] = useState({
    title: "",
    full_name: "",
    job_title: "",
    email: "",
    contact_no: "",
    address: "",
    gender: "",
    isMale: false,
    isFemale: false,
    isOther: false,
  });

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

  const [user, setUser] = useState([]);
  const [updatedUser, setUpdatedUser] = useState({});

  const [imageFileToUpload, setImageFileToUpload] = useState(null);
  const [videoFileToUpload, setVideoFileToUpload] = useState(null);

//   const [isVideoAvaiable, setIsVideoAvaiable] = useState(false);
//   const [contentLoaded, setContentLoaded] = useState(false);
//   const [showFallback, setShowFallback] = useState(false);
  
window.scrollTo({ top: 0, behavior: "smooth" });

useEffect(()=>{
    console.log(location)
    // setMediaImage(null);
    getSingleUserById(); 
  },[])

  useEffect(() => {
    const handleLoad = () => {
      setContentStatus('loaded');
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      // No direct way to handle "error" event on iframe due to cross-origin restrictions
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, [mediaVideoForIframe]); // Re-run effect if the iframe src changes

//   useEffect(()=>{
//     console.log(mediaImage)
//   },[mediaImage])
  
  const getSingleUserById = async (i) => {
    console.log("=======get single user details========")
    let decodedToken = decodeToken();
    let res = await UserService.getUserById(decodedToken.user_id);

    if (res.status == 200) {
      if (res.data.data != []) {
        console.log(res.data.data);
        setUser([]);
        res.data.data.map((user, index) => {
            setUser((prev) => {
                return [
                    ...prev,
                    {
                        user_id: user.user_id,
                        title: user.title,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        job_title: user.job_title,
                        email: user.email,
                        country: user.country,
                        city: user.city,
                        contact_no: user.contact_no,
                        gender: user.gender,
                        user_role: user.user_role,
                        image_url: user.image_url,
                        image_name: user.image_name,
                        video_url: user.video_url,
                        video_name: user.video_name,
                        Education: user.Education,
                        Experiences: user.Experiences,
                        Projects: user.Projects,
                        Links: user.Links,
                    },
                ];
            });
            setBasicInfoForm({
                full_name: user.title + user.first_name + " " + user.last_name,
                job_title: user.job_title,
                email: user.email,
                contact_no: user.contact_no,
                address: user.city + ", " + user.country,
                gender: user.gender,
                isMale: user.gender === "Male" ? true : false,
                isFemale: user.gender === "Female" ? true : false,
                isOther: user.gender != "Female" || user.gender != "Male"  ? true : false,
                image_url: user.image_url,
                video_url: user.video_url,
            });
            // setGender((user.gender).toLowerCase());
            setGender((user.gender).toLowerCase());

            setMediaImage(upload_bg)
            if (user.image_url) {
                let image_id = user.image_url.split("id=")[1];
                // let preview_base_url = `https://drive.google.com/thumbnail?id=${image_id}&sz=s4000`
                let preview_base_url = `https://drive.google.com/thumbnail?id=${image_id}`
                console.log(preview_base_url)
                setMediaImage(preview_base_url)
            }

            // setMediaVideo(upload_bg)
            if ( user.video_url) {
                // setIsVideoAvaiable(true)

                let video_id = user.video_url.split("id=")[1];
                // preview_base_url = `https://drive.google.com/file/d/1lpdepP7c98c62NZPY2EsBGXRLQJVuy1z/preview`
                let preview_video_base_url = `https://drive.google.com/file/d/${video_id}/preview`
                console.log(preview_video_base_url)

                setMediaVideoForIframe(preview_video_base_url)
            } else {
                // setIsVideoAvaiable(false)
            }
        });
      }
    }
  }

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

  const processPayload = async () => {
    console.log("------------------Processing payload---------------")
    let user = basicInfoForm;

    let full_name = user.full_name.split(' ');
    let title = full_name[0].split(".")[0]+".";
    let first_name = full_name[0].split(".")[1]
    let last_name = full_name[1]

    let address = user.address.split(", ");
    let city = address[0];
    let country = address[1];

    let decodedToken = decodeToken();

    let obj = {
        user_id: decodedToken.user_id,
        title: title,
        first_name: first_name,
        last_name: last_name,
        job_title: user.job_title,
        email: user.email,
        country: country,
        city: city,
        contact_no: user.contact_no,
        gender: user.gender,
        user_role: decodedToken.user_role,
        // Education: [],
        // Experiences: [],
        // Projects: [],
        // Links: [],
    }

    setUpdatedUser(obj);
    await updateBasicDetails(obj);
  }

  // Calling API
  const updateBasicDetails = async (updatedUser) => {
    console.log("------------------updating BasicDetails-----------------")
    let decodedToken = decodeToken();
    let res = await UserService.updateUser(updatedUser, updatedUser.user_id);

    if (res.status === 200) {

        console.log(imageFileToUpload)

        if (imageFileToUpload && videoFileToUpload){
            console.log("==============updating both image & video")

            // Update image only (users/drive/url/db/:user_id)
            let imageFormData = new FormData();
            imageFormData.append("user_image", imageFileToUpload);

            let res2 = await UserService.updateUserImage(imageFormData, updatedUser.user_id);

            if (res2.status === 200) {
                console.log("Image uploaded - User details updated successfully!")

                // Update video only (users/drive/url/db/video/:user_id)
                let videoFormData = new FormData();
                videoFormData.append("user_video", videoFileToUpload);

                let res3 = await UserService.updateUserVideo(videoFormData, updatedUser.user_id);
                if (res3.status === 200) {
                    console.log("Video uploaded - User details updated successfully!")

                } else {
                    setOpenAlert({
                        open: true,
                        alert: "Error while saving video.",
                        severity: "error",
                        variant: "standard",
                    });
                }

            } else {
                setOpenAlert({
                    open: true,
                    alert: "Error while saving image.",
                    severity: "error",
                    variant: "standard",
                });
            }


        } else if (imageFileToUpload) {
            console.log("==============updating only image")

            // Update image only (users/drive/url/db/:user_id)
            let imageFormData = new FormData();
            imageFormData.append("user_image", imageFileToUpload);

            let res2 = await UserService.updateUserImage(imageFormData, updatedUser.user_id);

            if (res2.status === 200) {
                console.log("Image uploaded - User details updated successfully!")

            } else {
                setOpenAlert({
                    open: true,
                    alert: "Error while saving image.",
                    severity: "error",
                    variant: "standard",
                });
            }
        } else if(videoFileToUpload) {
            console.log("==============updating only video")

            // Update video only (users/drive/url/db/video/:user_id)
            let videoFormData = new FormData();
            videoFormData.append("user_video", videoFileToUpload);

            let res3 = await UserService.updateUserVideo(videoFormData, updatedUser.user_id);
            if (res3.status === 200) {
                console.log("Video uploaded - User details updated successfully!")

            } else {
                setOpenAlert({
                    open: true,
                    alert: "Error while saving video.",
                    severity: "error",
                    variant: "standard",
                });
            }
        }
        
    } else {
        setOpenAlert({
            open: true,
            alert: "Error",
            severity: "error",
            variant: "standard",
        });
    }
  }

  const handleMediaUpload = (e) => {
    // handleImageUpload(e);
    const { files } = e.target;
    setImageFileToUpload(files[0]);

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const { result } = e.target;
      console.log(result);
      if (result) {
        setMediaImage(result);
      }
    };
    fileReader.readAsDataURL(files[0]);
  };
  
//   const handleVideoUpload = (e) => {
//     const { files } = e.target;
//     setVideoFileToUpload(files[0]);

//     const fileReader = new FileReader();
//     fileReader.onload = (e) => {
//       const { result } = e.target;
//       console.log(result);
//       if (result) {
//         setMediaVideo(result);
//       }
//     };
//     fileReader.readAsDataURL(files[0]);
//   };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        setVideoFileToUpload(file);

        if (file) {
            const url = URL.createObjectURL(file);
            setMediaVideo(url);
        }
    };

  return (
    <div id="portfolio-form">
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
                    Create Your Own ARfolio
                </Typography>
            </Grid>

            {/* ----------Basic Details & Uploads--------------------- */}

            {/* <ValidatorForm> */}
                <Grid
                    container
                    rowGap={2}
                    xl={10}
                    lg={10}
                    md={10}
                    sm={12}
                    xs={12}
                    className={classes.details_container}
                    display="flex"
                    justifyContent="center"
                >
                    {/* ------------------ Basic Details ----------------------- */}
    
                    <Grid
                        container
                        xl={8}
                        lg={8}
                        md={8}
                        sm={12}
                        xs={12}
                        className={classes.basic_details_container}
                        display="flex"
                    >
                        <Grid
                            container
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className={classes.basic_details_title_container}
                            display="flex"
                            // justifyContent="center"
                        >
                            <Typography variant="h4" className={classes.sub_title}>
                                Basic Details
                            </Typography>
                        </Grid>
                        
                        {/* -------- Row 1 - Full Name ------------- */}
                        <Grid
                            container
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className={classes.basic_details_row}
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
                        //   className={classes.basic_details_row}
                        >
                            <MyTextField
                                variant="outlined"
                                type="text"
                                id="full_name"
                                label="Full Name"
                                InputLabelProps={{ shrink: true }}
                                placeholder="Title. First Name Last Name (ex: Mr. Xxxx Yyyy)"
                                value={basicInfoForm.full_name}
                                onChange={(e) => {
                                    setBasicInfoForm({
                                        ...basicInfoForm,
                                        full_name: e.target.value,
                                    });
                                }}
                                style={{ width: "100%", paddingTop: "5px" }}
                            />
                        </Grid>
                        </Grid>

                        {/* -------- Row 2 - Job Title------------- */}
                        <Grid
                            container
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className={classes.basic_details_row}
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
                            //   className={classes.basic_details_row}
                            >
                                <MyTextField
                                    variant="outlined"
                                    type="text"
                                    id="job_title"
                                    label="Job Title"
                                    placeholder="Current Job Title"
                                    value={basicInfoForm.job_title}
                                    onChange={(e) => {
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            job_title: e.target.value,
                                        });
                                    }}
                                    style={{ width: "100%", paddingTop: "5px" }}
                                />
                            </Grid>
                        </Grid>

                        {/* -------- Row 3 - Email & Contact------------- */}
                        <Grid
                            container
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className={classes.basic_details_row}
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Grid
                                item
                                xl={6}
                                lg={6}
                                md={6}
                                sm={12}
                                xs={12}
                            >
                                <MyTextField
                                    variant="outlined"
                                    type="text"
                                    id="email"
                                    label="Email Address"
                                    placeholder="Email"
                                    value={basicInfoForm.email}
                                    onChange={(e) => {
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            email: e.target.value,
                                        });
                                    }}
                                    style={{ width: "100%", paddingTop: "5px" }}
                                />
                            </Grid>

                            <Grid
                                item
                                xl={5}
                                lg={5}
                                md={5}
                                sm={12}
                                xs={12}
                            >
                                <MyTextField
                                    variant="outlined"
                                    type="text"
                                    id="contact_no"
                                    label="Contact No"
                                    placeholder="+94 71 123 456 8"
                                    value={basicInfoForm.contact_no}
                                    onChange={(e) => {
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            contact_no: e.target.value,
                                        });
                                    }}
                                    style={{ width: "100%", paddingTop: "5px" }}
                                />
                            </Grid>
                        </Grid>

                        {/* -------- Row 4 - Address------------- */}
                        <Grid
                            container
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className={classes.basic_details_row}
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
                            //   className={classes.basic_details_row}
                            >
                                <MyTextField
                                    className={classes.txt_fields}
                                    variant="outlined"
                                    type="text"
                                    id="address"
                                    label="Address"
                                    placeholder="City, Country"
                                    value={basicInfoForm.address}
                                    onChange={(e) => {
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            address: e.target.value,
                                        });
                                    }}
                                    style={{ width: "100%", paddingTop: "5px" }}
                                />
                            </Grid>
                        </Grid>

                    </Grid>

                    {/* -------------------- Radio buttons --------------------- */}

                    <Grid
                        container
                        xl={8}
                        lg={8}
                        md={8}
                        sm={12}
                        xs={12}
                        display="flex"
                        justifyContent="space-between"
                        style={{marginBottom:"2vh"}}
                    >
                        <Grid
                            container
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className={classes.gender_title_container}
                            display="flex"
                            // justifyContent="center"
                        >
                            <Typography variant="h6" className={classes.sub_title}>
                                Gender
                            </Typography>
                        </Grid>

                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={gender}
                                // onChange={handlePaymentType}
                                onChange={(e) => {
                                    let type = e.target.value;
                                    if (type === "male") {
                                        // setGender("Male")
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            gender:"Male",
                                            isMale: true,
                                            isFemale:false,
                                            isOther:false
                                        });
                                    } else if (type === "female") {
                                        // setGender("Female")
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            gender: "Female",
                                            isMale: false,
                                            isFemale:true,
                                            isOther:false
                                        });
                                    } else {
                                        // setGender("Other")
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            gender:"Other",
                                            isMale: false,
                                            isFemale:false,
                                            isOther:true
                                        });
                                    }
                                    setGender(type)
                                }}
                            >
                                <FormControlLabel
                                value="male"
                                control={
                                    <Radio
                                    sx={{
                                        color: blue[800],
                                        "&.Mui-checked": {
                                        color: blue[600],
                                        },
                                    }}
                                    />
                                }
                                label="Male"
                                />
                                <FormControlLabel
                                value="female"
                                control={
                                    <Radio
                                    sx={{
                                        color: blue[800],
                                        "&.Mui-checked": {
                                        color: blue[600],
                                        },
                                    }}
                                    />
                                }
                                label="Female"
                                />
                                <FormControlLabel
                                value="other"
                                control={
                                    <Radio
                                    sx={{
                                        color: blue[800],
                                        "&.Mui-checked": {
                                        color: blue[600],
                                        },
                                    }}
                                    />
                                }
                                label="Other"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    {/* -------------------- Uploads --------------------- */}
                    <Grid
                        container
                        xl={8}
                        lg={8}
                        md={8}
                        sm={12}
                        xs={12}
                        className={classes.upload_main_container}
                        display="flex"
                        justifyContent="space-between"
                    >

                        {/* -------------------- Image Upload --------------------- */}
                        <Grid
                            container
                            xl={5}
                            lg={5}
                            md={5}
                            sm={12}
                            xs={12}
                            mt={2}
                            className={classes.image_upload_container}
                            style={{
                                backgroundImage: `url${mediaImage}`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <Typography variant="h6" className={classes.sub_title}>
                                Profile Image
                            </Typography>

                            <img
                                src={mediaImage}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    marginTop:"2vh"
                                }}
                                alt="User Image"
                            />

                            <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                            </Grid>
                        </Grid>
                        
                        {/* -------------------- Video Upload --------------------- */}
                        <Grid
                            container
                            xl={5}
                            lg={5}
                            md={5}
                            sm={12}
                            xs={12}
                            mt={2}
                            className={classes.video_upload_container}
                            style={{
                                // backgroundImage: `url${mediaVideo}`,
                                backgroundImage: `url${'https://drive.google.com/uc?id=1lpdepP7c98c62NZPY2EsBGXRLQJVuy1z'}`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                            
                        >
                            <Typography variant="h6" className={classes.sub_title}>
                                Video Biography
                            </Typography>

                            {mediaVideoForIframe == null && mediaVideo == null ? (
                                <img
                                    src={upload_video_bg}
                                    loading="lazy"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        marginTop:"2vh"
                                    }}
                                    alt="User Video Not Found"
                                />
                            ) : mediaVideo ? (//if file choosen from the file chooser - loads to a video tag
                                <video width="100%" height="auto" controls src={mediaVideo} autoPlay />

                            ) : ( // if loaded from backend - loads to a iframe tag
                                <>
                                    {contentStatus === 'loading' && (
                                        <div 
                                            style={{
                                                position: 'absolute', // Use absolute positioning to overlay on top of the Grid
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                background: 'rgba(255, 255, 255, 0.5)', // Optional: Add a semi-transparent overlay
                                            }}
                                          >
                                            <Typography variant="h5" className={classes.sub_title}>
                                              Loading...
                                            </Typography>
                                          </div>
                                    )}
                                    {contentStatus === 'error' && <img src={upload_video_bg} alt="Content not available" />}            

                                    <iframe
                                        ref={iframeRef}
                                        width="100%"
                                        height="auto"
                                        src={mediaVideoForIframe}
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                        style={{ display: contentStatus === 'loaded' ? 'block' : 'none' }}
                                        // src="https://drive.google.com/file/d/1lpdepP7c98c62NZPY2EsBGXRLQJVuy1z/preview"
                                        // onLoad={() => setContentLoaded(true)}
                                        // style={{ display: contentLoaded ? 'block' : 'none' }}
                                    ></iframe>
                                </>
                            )}

                        </Grid>

                        {/* -------------------- Upload Buttons --------------------- */}
                        <Grid
                            container
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            mt={2}
                            className={classes.upload_main_container}
                            display="flex"
                            justifyContent="space-between"
                        >
                            {/* ---------- Upload Image button -------------- */}

                            <Grid
                                item
                                xl={5}
                                lg={5}
                                md={5}
                                sm={12}
                                xs={12}
                                className={classes.btn_save_image_container}
                            >
                                <FileChooser
                                    text="Upload"
                                    multiple={false}
                                    onUpload={(e) => {
                                        handleMediaUpload(e);
                                        console.log( e.target.files[0])
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            user_image: e.target.files[0],
                                        });
                                        setMediaImage(e.target.files[0]);
                                    }}
                                    // displayFileName={true}
                                    
                                />
                            </Grid>
                            
                            {/* ---------- Upload Video button -------------- */}

                            <Grid
                                item
                                xl={5}
                                lg={5}
                                md={5}
                                sm={12}
                                xs={12}
                                className={classes.btn_save_video_container}
                            >
                                <FileChooser
                                    text="Upload"
                                    multiple={false}
                                    onUpload={(e) => {
                                        handleVideoUpload(e);
                                        // console.log(e.target.files[0])
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            user_video: e.target.files[0],
                                        });
                                        // setMediaVideo(e.target.files[0]);
                                    }}
                                    // displayFileName={true}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* ------- Next button ------- */}
                    <Grid
                        container
                        xl={8}
                        lg={8}
                        md={8}
                        sm={12}
                        xs={12}
                        className={classes.btn_next_container}
                        display="flex"
                        justifyContent="flex-end"
                    >
                        <MyButton
                            label="Next"
                            size="small"
                            variant="outlined"
                            type="button"
                            style={{ width: "20%", height: "100%" }}
                            className={classes.btn_next}
                            onClick={async () => {
                                processPayload();
                                setTimeout(() => {
                                    navigate("/education"/* , { state: { basicData: user } } */);
                                }, 1000);
                            }}
                        />
                    </Grid>
                </Grid>
            {/* </ValidatorForm> */}
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

// export default MyButton;
export default withStyles(styleSheet)(BasicDetails);
