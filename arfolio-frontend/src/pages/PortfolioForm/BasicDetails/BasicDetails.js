import React, { useState, useEffect } from "react";
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

import upload_bg from "../../../assets/images/Portfolio/choose_image.jpg";

import UserService from "../../../services/UserService";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const BasicDetails = (props) => {
  const { classes } = props;
  const navigate = useNavigate();

  const location = useLocation();
  console.log(location)

  // Call updateUser API only if Next button is clicked, if back button(of EducationDetails.js) is clicked, dont call the API.
  const [isUpdateUser, setIsUpdateUser] = useState(()=>{
    if(location.state && !location.state.proceedUpdateUser || location.state == null){
        console.log("Don't update user==============")
        return false;
    } else {
        console.log("Do update user==============")
        return true;
    }
  });

  const [gender, setGender] = useState("Male");

  const [mediaImage, setMediaImage] = useState(upload_bg);
  const [mediaVideo, setMediaVideo] = useState(upload_bg);

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

  useEffect(()=>{
    console.log(location)
    getSingleUserById(); 
  },[])

 /*  useEffect(() => {
    // localStorage.setItem("payload", JSON.stringify(updatedUser));
    if (!isUpdateUser && updatedUser.user_id == undefined) {
        console.log("Dont call the  API");
        return;
    }
    updateBasicDetails();
  }, [updatedUser]);  */
  
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
            });
            setGender((user.gender).toLowerCase());
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
    setIsUpdateUser(true);
  }

  const updateBasicDetails = async (updatedUser) => {
    console.log("------------------updating BasicDetails-----------------")
    let decodedToken = decodeToken();
    let res = await UserService.updateUser(updatedUser, updatedUser.user_id);

    if (res.status === 200) {
        console.log("User details updated successfully!")
    } else {
        setOpenAlert({
            open: true,
            alert: "Error",
            severity: "error",
            variant: "standard",
        });
    }
  }

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
                                            isMale: true,
                                            isFemale:false,
                                            isOther:false
                                        });
                                    } else if (type === "female") {
                                        // setGender("Female")
                                        setBasicInfoForm({
                                            ...basicInfoForm,
                                            isMale: false,
                                            isFemale:true,
                                            isOther:false
                                        });
                                    } else {
                                        // setGender("Other")
                                        setBasicInfoForm({
                                            ...basicInfoForm,
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
                            />
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
                                backgroundImage: `url${mediaVideo}`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <Typography variant="h6" className={classes.sub_title}>
                                Video Biography
                            </Typography>

                            <img
                                src={mediaVideo}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    marginTop:"2vh"
                                }}
                            />
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
                                    // handleImageUpload(e);
                                    // handleMediaUpload(e);
                                    // setNewProductFormData({
                                    //     ...newProductFormData,
                                    //     product_image: e.target.files[0],
                                    // });
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
                                    // handleImageUpload(e);
                                    // handleMediaUpload(e);
                                    // setNewProductFormData({
                                    //     ...newProductFormData,
                                    //     product_image: e.target.files[0],
                                    // });
                                    setMediaVideo(e.target.files[0]);
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
                                }, 500);
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
