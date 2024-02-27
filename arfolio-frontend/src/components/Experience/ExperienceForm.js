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

const ExperienceForm = (props) => {
  const { classes } = props;

  const [experienceForm, setExperienceForm] = useState(props.data);
  console.log(experienceForm)

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
    setSelectedYear(new Date().getFullYear().toString());
    setExperienceForm(props.data);
  },[]);

  // Initialize with experience data prop when the component mounts or the prop changes
  useEffect(() => {
    setExperienceForm(props.data); 
  }, [props.data]);

  // Handle changes to the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = {
        ...experienceForm,
        [name]: value,
    }
    setExperienceForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
    props.onUpdate(updated);
  };

  // Handle changes to the dropdowns
  const handleAutoCompleteChange = (e, name) => {
    const { innerText } = e.target;
    let updated = {
        ...experienceForm,
        [name]: innerText,
    }
    setExperienceForm(updated)
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
                    {`Experience ${props.indexValue+1}`}
                </Typography>
            </Grid>

            {/* -------- Row 1 - Employer ------------- */}
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
                        id="employer"
                        label="Employer"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Employer Name"
                        value={experienceForm.employer}
                        // onChange={(e) => {
                        //     setExperienceForm({
                        //         ...experienceForm,
                        //         employer_name: e.target.value,
                        //     });
                        // }}
                        name="employer"
                        onChange={handleChange}
                        style={{ width: "100%", paddingTop: "5px"}}
                    />
                </Grid>
            </Grid>

            {/* -------- Row 2 - Employer Link ------------- */}
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
                        id="employer_link"
                        label="Employer Link"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Employer Link"
                        value={experienceForm.employer_link}
                        name="employer_link"
                        onChange={handleChange}
                        style={{ width: "100%", paddingTop: "5px"}}
                    />
                </Grid>
            </Grid>

            {/* -------- Row 3 - Job Title------------- */}
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
                        id="job_title"
                        label="Job Title"
                        placeholder="Job Title"
                        value={experienceForm.job_title}
                        // onChange={(e) => {
                        //     setExperienceForm({
                        //         ...experienceForm,
                        //         job_title: e.target.value,
                        //     });
                        // }}
                        name="job_title"
                        onChange={handleChange}
                        style={{ width: "100%", paddingTop: "5px", color:"#000" }}
                    />
                </Grid>
            </Grid>

            {/* -------- Row 4 - City & Country------------- */}
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
                        id="city"
                        label="City"
                        placeholder="City"
                        value={experienceForm.city}
                        // onChange={(e) => {
                        //     setExperienceForm({
                        //     ...experienceForm,
                        //     city: e.target.value,
                        //     });
                        // }}
                        name="city"
                        onChange={handleChange}
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
                        id="country"
                        label="Country"
                        placeholder="Country"
                        value={experienceForm.country}
                        // onChange={(e) => {
                        //     setExperienceForm({
                        //     ...experienceForm,
                        //     country: e.target.value,
                        //     });
                        // }}
                        name="country"
                        onChange={handleChange}
                        style={{ width: "100%", paddingTop: "5px" }}
                    />
                </Grid>
            </Grid>

            {/* -------- Row 5 - Start Date------------- */}
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
                            value={experienceForm.start_month}
                            disablePortal
                            size="small"
                            disabledItemsFocusable
                            // onChange={(e)=>{
                            //     setExperienceForm({
                            //         ...experienceForm,
                            //         start_month: e.target.value,
                            //     });
                            // }}
                            onChange={(e,v)=>{handleAutoCompleteChange(e, "start_month")}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Month"
                                    styles={{ color: "red" }}
                                    value={experienceForm.start_month}
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
                            value={experienceForm.start_year}
                            disablePortal
                            size="small"
                            disabledItemsFocusable
                            onChange={(e,v)=>{handleAutoCompleteChange(e, "start_year")}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Month"
                                    styles={{ color: "red" }}
                                    value={experienceForm.start_year}
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

            {/* -------- Row 6 - End Date------------- */}
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
                            value={experienceForm.end_month}
                            disablePortal
                            size="small"
                            disabledItemsFocusable
                            onChange={(e,v)=>{handleAutoCompleteChange(e, "end_month")}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Month"
                                    styles={{ color: "red" }}
                                    value={experienceForm.end_month}
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
                            value={experienceForm.end_year}
                            disablePortal
                            size="small"
                            disabledItemsFocusable
                            onChange={(e,v)=>{handleAutoCompleteChange(e, "end_year")}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Month"
                                    styles={{ color: "red" }}
                                    value={experienceForm.end_year}
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

export default withStyles(styleSheet)(ExperienceForm);
