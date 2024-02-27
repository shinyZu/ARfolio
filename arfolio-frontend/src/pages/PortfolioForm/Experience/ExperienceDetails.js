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
import ExperienceForm from "../../../components/Experience/ExperienceForm";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import {jwtDecode} from "jwt-decode";

import UserService from "../../../services/UserService";
import ExperienceService from "../../../services/ExperienceService";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const ExperienceDetails = (props) => {
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

  const [experienceForms, setExperienceForms] =  useState([{id:0,}]);

  const [user, setUser] = useState([]);
  const [updatedExperienceList, setUpdatedExperienceList] = useState([{id:0,}]);
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
        setUpdatedExperienceList(res.data.data[0].Experiences);
        const experienceWithIds = res.data.data[0].Experiences.map((item, index) => ({
          ...item,
          id: index
        }));

        setExperienceForms(experienceWithIds);
      }
    }
  }

  // Add button in child component - ExperienceForm
  const addExperienceForm = () => {
    const newExperience = {
      id: experienceForms.length,
      job_title: "",
      employer: "",
      employer_link: "",
      city: "",
      country: "",
      start_month: "",
      start_year: "",
      end_month: "",
      end_year: "",
    };
    setExperienceForms([...experienceForms, newExperience]);
  };

  // Delete button in child component - ExperienceForm
  const removeExperienceForm = async (id) => {
    // setExperienceForms(experienceForms.filter(experience => experience.experience_id !== id));
    // await deleteExperience(id);

    // Check if the length of experienceForms is 1
    if (experienceForms.length === 1) {
      console.log("Cannot remove the last experience form.");
      return; 
    }

    // Proceed with the removal if there are more than 1 experience forms
    setExperienceForms(experienceForms.filter(experience => experience.experience_id !== id));
    
    // Assuming deleteExperience is an API call or similar asynchronous operation
    await deleteExperience(id);
  };

  // Handler to update individual experience items
  const handleUpdateExperience = (updatedExperience) => {
    console.log("==================updatedExperience============", updatedExperience);
    setExperienceForms(currentList =>
      currentList.map( experience =>
        experience.experience_id === updatedExperience.experience_id ? updatedExperience : experience
      )
    );
  };

  // trigger on clicking Next button
  const updateAllExperiences = async () => {
    console.log('Updated experience list:', experienceForms);
    await updateExperienceDetails(experienceForms);
  };

  // API call to update exisiting & newly created experiences
  const updateExperienceDetails = async (experienceForms) => {
    let res = await ExperienceService.updateExperiencesAsBulk(experienceForms);

    if (res.status === 200) {
        console.log("Experience details updated successfully!")
    } else {
        setOpenAlert({
            open: true,
            alert: "Error",
            severity: "error",
            variant: "standard",
        });
    }
  }

  // API call to delete experience
  const deleteExperience = async(id) => {
    let res = await ExperienceService.deleteExperience(id);

    if (res.status === 200) {
        console.log("Experience deleted successfully!")
    } else {
      console.log("Error")
        // setOpenAlert({
        //     open: true,
        //     alert: "Error",
        //     severity: "error",
        //     variant: "standard",
        // });
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

            {/* ----------Experience--------------------- */}

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
                {/* ------------------ Experience Details ----------------------- */}

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
                            Work Experience
                        </Typography>
                    </Grid>
                    
                    {/* <ExperienceForm /> */}

                    {experienceForms.map((form, index) => (
                         <ExperienceForm
                            ref={childRef}
                            key={form.experience_id}
                            indexValue={form.id}
                            addForm={addExperienceForm}
                            removeForm={() => removeExperienceForm(form.experience_id)}
                            onUpdate={handleUpdateExperience}
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
                            navigate("/education");
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
                          updateAllExperiences();
                          setTimeout(() => {
                            navigate("/projects");
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
export default withStyles(styleSheet)(ExperienceDetails);
