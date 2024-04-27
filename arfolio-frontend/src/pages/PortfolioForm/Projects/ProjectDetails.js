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

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import Header from "../../../components/Header/Header";
import MyTextField from "../../../components/common/MyTextField/MyTextField";
import MyButton from "../../../components/common/MyButton/MyButton";
import Footer from "../../../components/Footer/Footer";
import MySnackBar from "../../../components/common/MySnackBar/MySnackbar";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import FileChooser from "../../../components/common/FileChooser/FileChooser";
import ProjectForm from "../../../components/Projects/ProjectForm";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import {jwtDecode} from "jwt-decode";

import UserService from "../../../services/UserService";
import ProjectService from "../../../services/ProjectService";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const ProjectDetails = (props) => {
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

  const [projectForms, setProjectForms] =  useState([{id:0,}]);

  const [user, setUser] = useState([]);
  const [updatedProjectList, setUpdatedProjectList] = useState([{id:0,}]);
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
        setUpdatedProjectList(res.data.data[0].Projects);
        const projectsWithIds = res.data.data[0].Projects.map((item, index) => ({
          ...item,
          id: index
        }));

        setProjectForms(projectsWithIds);
      }
    }
  }

  // Add button in child component - ProjectForm
  const addProjectForm = () => {
    const newProject = {
      id: projectForms.length,
      project_title: "",
      project_link: "",
      description: "",
      start_month: "",
      start_year: "",
      end_month: "",
      end_year: "",
    };
    setProjectForms([...projectForms, newProject]);
  };

  // Delete button in child component - ProjectForm
  const removeProjectForm = async (id) => {
    // Check if the length of projectForms is 1
    if (projectForms.length === 1) {
      console.log("Cannot remove the last project form.");
      return; 
    }

    // Proceed with the removal if there are more than 1 project forms
    setProjectForms(projectForms.filter(project => project.project_id !== id));
    
    // Assuming deleteProject is an API call or similar asynchronous operation
    await deleteProject(id);
  };

  // Handler to update individual project items
  const handleUpdateProject = (updatedProject) => {
    console.log("==================updatedProject============", updatedProject);
    setProjectForms(currentList =>
      currentList.map( project =>
        project.project_id === updatedProject.project_id ? updatedProject : project
      )
    );
  };

  // trigger on clicking Next button
  const updateAllProjects = async () => {
    console.log('Updated project list:', projectForms);
    await updateProjectDetails(projectForms);
  };

  // API call to update exisiting & newly created experiences
  const updateProjectDetails = async (projectForms) => {
    let res = await ProjectService.updateProjectsAsBulk(projectForms);

    if (res.status === 200) {
        console.log("Projects details updated successfully!")
    } else {
        setOpenAlert({
            open: true,
            alert: "Error",
            severity: "error",
            variant: "standard",
        });
    }
  }

  // API call to delete project
  const deleteProject = async(id) => {
    let res = await ProjectService.deleteProject(id);

    if (res.status === 200) {
        console.log("Projects deleted successfully!")
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

            {/* ----------Projects--------------------- */}

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
                {/* ------------------ Projects Details ----------------------- */}

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
                        xl={9}
                        lg={9}
                        md={9}
                        sm={9}
                        xs={9}
                        className={classes.basic_details_title_container}
                        display="flex"
                        // justifyContent="center"
                    >
                        <Typography variant="h4" className={classes.sub_title}>
                            Projects
                        </Typography>
                    </Grid>
                    
                    {/*  Add / Delete Icons */}
                    {projectForms.length == 0 && (
                      <Grid
                          item
                          container
                          xl={3}
                          lg={3}
                          md={3}
                          sm={12}
                          xs={12}
                          style={{marginTop:"-1vh"}}
                          display="flex"
                          justifyContent="flex-end"
                      >
                          <Tooltip title="Add">
                              <IconButton>
                                  <AddCircleIcon
                                      style={{color:"#1abc9c"}}
                                      fontSize="large"
                                      onClick={()=>{addProjectForm()}}
                                  />
                              </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                              <IconButton>
                                  <DeleteIcon
                                      style={{color:"#e74c3c"}}
                                      fontSize="large"
                                      onClick={()=>{removeProjectForm(0)}}
                                  />
                              </IconButton>
                          </Tooltip>
                      </Grid> 
                    )}

                    {projectForms.map((form, index) => (
                         <ProjectForm
                            ref={childRef}
                            key={form.project_id}
                            indexValue={form.id}
                            addForm={addProjectForm}
                            removeForm={() => removeProjectForm(form.project_id)}
                            onUpdate={handleUpdateProject}
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
                            navigate("/experiences");
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
                          updateAllProjects();
                          setTimeout(() => {
                            navigate("/links");
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
export default withStyles(styleSheet)(ProjectDetails);
