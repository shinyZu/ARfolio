import React, { useState, useEffect, Fragment, useRef } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Autocomplete from '@mui/material/Autocomplete';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { blue } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";

import Header from "../../../components/Header/Header";
import MyTextField from "../../../components/common/MyTextField/MyTextField";
import MyButton from "../../../components/common/MyButton/MyButton";
import Footer from "../../../components/Footer/Footer";
import MySnackBar from "../../../components/common/MySnackBar/MySnackbar";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import FileChooser from "../../../components/common/FileChooser/FileChooser";
import EducationForm from "../../../components/Education/EducationForm";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import {jwtDecode} from "jwt-decode";
import { v4 as uuidv4 } from 'uuid';

import UserService from "../../../services/UserService";
import EducationService from "../../../services/EducationService";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const EducationDetails = (props) => {
  const { classes } = props;
  const navigate = useNavigate();
  const location = useLocation();

  // Create a ref to hold the child component reference
  const childRef = useRef();

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

  const [educationForms, setEducationForms] = useState([{id:0,}]);

  const [user, setUser] = useState([]);
  const [updatedEducationList, setUpdatedEducationList] = useState([{id:0,}]);
  const [decodedToken, setDecodedToken] = useState({});

  useEffect(()=>{
    getSingleUserById();
  },[])

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

  const getSingleUserById = async (i) => {

    let decodedToken = decodeToken();
    let res = await UserService.getUserById(decodedToken.user_id);

    if (res.status == 200) {
      if (res.data.data != []) {
        console.log(res.data.data);
        setUser(res.data.data);
        setUpdatedEducationList(res.data.data[0].Education);
        // setEducationForms(res.data.data[0].Education);

        // Assuming res.data.data[0].Education is your array
        const educationWithIds = res.data.data[0].Education.map((item, index) => ({
          ...item, // Spread the existing properties
          id: index // Add a new `id` property
        }));

        setEducationForms(educationWithIds);
      }
    }
  }

  // Add button in child component - EducationForm
  const addEducationForm = () => {
    const newEducation = {
      // Define the structure of a new education object
      // For simplicity, using Date.now() to generate a pseudo-unique ID
      city: "",
      country: "",
      degree: "",
      end_month: "",
      end_year: "",
      school: "",
      start_month: "",
      start_year: "",
      id: educationForms.length
    };
    setEducationForms([...educationForms, newEducation]);
  };

  // Delete button in child component - EducationForm
  const removeEducationForm = async (id) => {
    setEducationForms(educationForms.filter(education => education.education_id !== id));
    await deleteEducation(id);
  };

  // Handler to update individual education items
  const handleUpdateEducation = (updatedEducation) => {
    console.log("==================updatedEducation============", updatedEducation);
    setEducationForms(currentList =>
      currentList.map(education =>
        education.education_id === updatedEducation.education_id ? updatedEducation : education
      )
    );
  };

  // trigger on clicking Next button
  const updateAllEducations = async () => {
    console.log('Updated education list:', educationForms);
    await updateEducationDetails(educationForms);
    
    // if (childRef.current) {
    //   let list = childRef.current.handleUpdate();
    //   // let list = childRef.current.getEducationList();
    //   console.log('Updated list:', list);
    // }
  };

  // API call to update exisiting & newly created educations
  const updateEducationDetails = async (educationForms) => {
    console.log("------------------updating Education Details-----------------")
    let res = await EducationService.updateEducationAsBulk(educationForms);

    if (res.status === 200) {
        console.log("Education details updated successfully!")
    } else {
        setOpenAlert({
            open: true,
            alert: "Error",
            severity: "error",
            variant: "standard",
        });
    }
  }

  // API call to delete education
  const deleteEducation = async(id) => {
    console.log("------------------deleting Education Details-----------------", id)
    let res = await EducationService.deleteEducation(id);

    if (res.status === 200) {
        console.log("Education deleted successfully!")
    } else {
        setOpenAlert({
            open: true,
            alert: "Error",
            severity: "error",
            variant: "standard",
        });
    }

  }

  // Function to call the child's processEducationList function - not in use
  const processPayload = async () => {
    if (childRef.current) {
      let list = childRef.current.getEducationList();
      
      const newList = list.map((item, index) => ({
          ...item,
          id: updatedEducationList.length
      }));


      let arr = [...updatedEducationList, ...newList]
      setUpdatedEducationList(arr);
      
      await updateEducationDetails(arr);
      // setIsUpdateEducation(true);
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

            {/* ----------Education--------------------- */}

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
                {/* ------------------ Education Details ----------------------- */}

                <Grid
                    container
                    xl={8}
                    lg={8}
                    md={8}
                    sm={8}
                    xs={8}
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
                            Education
                        </Typography>
                    </Grid>
                    
                    {/* <EducationForm /> */}

                    {educationForms.map((form, index) => (
                        <EducationForm
                            ref={childRef}
                            // key={index}
                            key={form.education_id}
                            indexValue={form.id}
                            addForm={addEducationForm}
                            // removeForm={() => removeEducationForm(index)}
                            removeForm={() => removeEducationForm(form.education_id)}
                            onUpdate={handleUpdateEducation}
                            data={form}
                        />
                    ))}

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
                        label="Back"
                        size="small"
                        variant="outlined"
                        type="button"
                        style={{ width: "20%", height: "100%", marginRight:"2vw" }}
                        className={classes.btn_back}
                        onClick={() => {
                            navigate("/basic"/* , { state: { proceedUpdateUser: false }} */ );
                        }}
                    />

                    <MyButton
                        label="Next"
                        size="small"
                        variant="outlined"
                        type="button"
                        style={{ width: "20%", height: "100%" }}
                        className={classes.btn_next}
                        onClick={() => {
                          updateAllEducations();
                          setTimeout(() => {
                            navigate("/experiences");
                          }, 500);
                        }}
                    />
                </Grid>
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

// export default MyButton;
export default withStyles(styleSheet)(EducationDetails);
