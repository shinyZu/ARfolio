import React, { useState, useEffect, Fragment } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import MyTextField from "../common/MyTextField/MyTextField";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

const ProjectForm = (props) => {
    const { classes } = props;

    const [projectForm, setProjectForm] = useState(props.data);
    console.log(projectForm)
  
    const [selectedMonth, setSelectedMonth] = useState('');
  
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
  
    const [selectedYear, setSelectedYear] = useState('');
  
    // Generate an array of years from 1990 to the current year in descending order
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1989 }, (_, index) => currentYear - index);
  
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSelectedYear(new Date().getFullYear().toString());
        setProjectForm(props.data);
    },[]);
  
    // Initialize with experience data prop when the component mounts or the prop changes
    useEffect(() => {
        setProjectForm(props.data); 
    }, [props.data]);
  
    // Handle changes to the input fields
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      let updated = {
          ...projectForm,
          [name]: value,
      }
      setProjectForm(prevState => ({
        ...prevState,
        [name]: value,
      }));
      props.onUpdate(updated);
    };
  
    // Handle changes to the dropdowns
    const handleAutoCompleteChange = (e, name) => {
      const { innerText } = e.target;
      let updated = {
          ...projectForm,
          [name]: innerText,
      }
      setProjectForm(updated)
      props.onUpdate(updated);
    };
  
    return (
        <>
          <Fragment key={props.indexValue}>
              <Grid
                  item
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.gender_title_container}
                  display="flex"
                  // justifyContent="center"
                  style={{marginBottom:"2vh"}}
              >
                  <Typography variant="h5" className={classes.sub_title} style={{color:"#40739e", marginTop:"2vh"}}>
                      {`Project ${props.indexValue+1}`}
                  </Typography>
              </Grid>
  
              {/* -------- Row 1 - Project Title ------------- */}
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
                          id="project_title"
                          label="Project Title"
                          InputLabelProps={{ shrink: true }}
                          placeholder="Project Title"
                          value={projectForm.project_title}
                          name="project_title"
                          onChange={handleChange}
                          style={{ width: "100%", paddingTop: "5px"}}
                      />
                  </Grid>
              </Grid>
  
              {/* -------- Row 2 - Project Link ------------- */}
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
                          id="project_link"
                          label="Project Link"
                          InputLabelProps={{ shrink: true }}
                          placeholder="Project Link"
                          value={projectForm.project_link}
                          name="project_link"
                          onChange={handleChange}
                          style={{ width: "100%", paddingTop: "5px"}}
                      />
                  </Grid>
              </Grid>
  
              {/* -------- Row 3 - Description------------- */}
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
                  >
                      <MyTextField
                          variant="outlined"
                          type="text"
                          id="description"
                          label="Description"
                          placeholder="Description"
                          value={projectForm.description}
                          name="description"
                          onChange={handleChange}
                          style={{ width: "100%", paddingTop: "5px", color:"#000" }}
                      />
                  </Grid>
              </Grid>
  
              {/* -------- Row 4 - Start Date------------- */}
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
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className={classes.gender_title_container}
                      display="flex"
                      // justifyContent="center"
                      style={{marginBottom:"2vh"}}
                  >
                      <Typography variant="h6" className={classes.sub_title}>
                          Start Date
                      </Typography>
                  </Grid>
  
                  <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                  >
                          <Autocomplete
                              id="start_month"
                              name="start_month"
                              options={months}
                              getOptionLabel={(option) => option}
                              value={projectForm.start_month}
                              disablePortal
                              size="small"
                              disabledItemsFocusable
                              onChange={(e,v)=>{handleAutoCompleteChange(e, "start_month")}}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      label="Month"
                                      styles={{ color: "red" }}
                                      value={projectForm.start_month}
                                  />
                              )}
                          />
                  </Grid>
  
                  <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                  >
                         <Autocomplete
                              id="start_year"
                              name="start_year"
                              options={years.map(year => year.toString())}
                              getOptionLabel={(option) => option}
                              value={projectForm.start_year}
                              disablePortal
                              size="small"
                              disabledItemsFocusable
                              onChange={(e,v)=>{handleAutoCompleteChange(e, "start_year")}}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      label="Year"
                                      styles={{ color: "red" }}
                                      value={projectForm.start_year}
                                  />
                              )}
                          />
                  </Grid>
  
                  <Grid
                      item
                      xl={3}
                      lg={3}
                      md={3}
                      sm={12}
                      xs={12}
                  ></Grid>
              </Grid>
  
              {/* -------- Row 5 - End Date------------- */}
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
                  style={{marginBottom:"4vh"}}
              >
                  <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className={classes.gender_title_container}
                      display="flex"
                      // justifyContent="center"
                      style={{marginBottom:"2vh"}}
                  >
                      <Typography variant="h6" className={classes.sub_title}>
                          End Date
                      </Typography>
                  </Grid>
  
                  <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                  >
                         <Autocomplete
                              id="end_month"
                              name="end_month"
                              options={months}
                              getOptionLabel={(option) => option}
                              value={projectForm.end_month}
                              disablePortal
                              size="small"
                              disabledItemsFocusable
                              onChange={(e,v)=>{handleAutoCompleteChange(e, "end_month")}}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      label="Month"
                                      styles={{ color: "red" }}
                                      value={projectForm.end_month}
                                  />
                              )}
                          />
                  </Grid>
  
                  <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                  >
                           <Autocomplete
                              id="end_year"
                              name="end_year"
                              options={years.map(year => year.toString())}
                              getOptionLabel={(option) => option}
                              value={projectForm.end_year}
                              disablePortal
                              size="small"
                              disabledItemsFocusable
                              onChange={(e,v)=>{handleAutoCompleteChange(e, "end_year")}}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      label="Year"
                                      styles={{ color: "red" }}
                                      value={projectForm.end_year}
                                  />
                              )}
                          />
                  </Grid>
  
                  {/*  Add / Delete Icons */}
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
                                  onClick={props.addForm}
                              />
                          </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                          <IconButton>
                              <DeleteIcon
                                  style={{color:"#e74c3c"}}
                                  fontSize="large"
                                  onClick={props.removeForm}
                              />
                          </IconButton>
                      </Tooltip>
                  </Grid>
              </Grid>
          </Fragment>
      </>
    );
};

export default withStyles(styleSheet)(ProjectForm);
