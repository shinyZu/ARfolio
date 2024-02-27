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

import upload_bg from "../../../assets/images/Portfolio/choose_image.jpg";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const EducationDetails = (props) => {
  const { classes } = props;

  const navigate = useNavigate();

  // Create a ref to hold the child component reference
  const childRef = useRef();

  const location = useLocation();

  // Call updateUser API only if Next button is clicked, if back button(of EducationDetails.js) is clicked, dont call the API.
  const [isUpdateEducation, setIsUpdateEducation] = useState(()=>{
    if(location.state && !location.state.proceedUpdateEducation){
        return false;
    } else {
        return true;
    }
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

  const [educationForms, setEducationForms] = useState([{id:0,}]);

  const [user, setUser] = useState([]);
  const [updatedEducationList, setUpdatedEducationList] = useState([{id:0,}]);
  const [decodedToken, setDecodedToken] = useState({});

  useEffect(()=>{
    getSingleUserById();
  },[])

 /*  useEffect(() => {
    console.log(updatedEducationList)
    if (!isUpdateEducation) {
        console.log("Dont call the  API");
        return;
    }
    updateEducationDetails();
  }, [updatedEducationList]);  */
  
  /* const addEducationForm = (list) => {
    console.log(list)
    setEducationForms([...educationForms, { id: educationForms.length }]);
    // setEducationForms([...educationForms, { id: educationForms.length, ...list }]);
    
  }; */

  //----------------latest-----------------------
  /* const addEducationForm = (list) => {
    console.log(list);

    // Generate new items from the list with an id for each
    const newList = list.map((item, index) => ({
        ...item,
        id: educationForms.length
    }));

    // Combine the existing educationForms with the new list and update the state
    setEducationForms([...educationForms, ...newList]);
  }; */

  //----------------latest-----------------------
  /* const removeEducationForm = (indexToRemove) => {
    // Only allow removal if there are more than 1 items in the array
    if (educationForms.length > 1) {
      setEducationForms(educationForms.filter((_, index) => index !== indexToRemove));
    } else {
      // Optionally, alert the user that they cannot remove the last form
      console.log("Cannot remove the last form. There must be at least one form.");
    }
  }; */

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

  const removeEducationForm = (id) => {
    setEducationForms(educationForms.filter(education => education.education_id !== id));
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
    // Here you would handle the batch update logic, possibly sending the updated educationList to a backend
    console.log('Updated education list:', educationForms);

    let listToUpdate = [];
    let listToSave = [];

    educationForms.map((obj)=>{
        if (obj._id) {
          listToUpdate.push(obj)
        } else {
          listToSave.push(obj)
        }
    })

    console.log("listToUpdate", listToUpdate);
    console.log("listToSave", listToSave)

    await updateEducationDetails(educationForms);
    
    // if (childRef.current) {
    //   let list = childRef.current.handleUpdate();
    //   // let list = childRef.current.getEducationList();
    //   console.log('Updated list:', list);
    // }
  };

  // Function to call the child's processEducationList function
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
      setIsUpdateEducation(true);
    }
  }

  const updateEducationDetails = async (educationForms) => {
    console.log("------------------updating Education Details-----------------")
    let decodedToken = decodeToken();
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

  console.log(educationForms);
  console.log(updatedEducationList);

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
                            navigate("/basic", { state: { proceedUpdateUser: false } } );
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
                        // onClick={updateAllEducations}
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
