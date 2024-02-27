import React, { useState, useEffect, Fragment, useImperativeHandle, forwardRef } from "react";

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

const EducationForm = forwardRef((props, ref) => {
  const { classes } = props;

  const [educationList, setEducationList] = useState([]);
  const [educationForm, setEducationForm] = useState(props.data);
  console.log(educationForm)

  const [selectedMonth, setSelectedMonth] = useState('');

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const [selectedYear, setSelectedYear] = useState('');

  // Generate an array of years from 1990 to the current year
  // const years = Array.from({ length: new Date().getFullYear() - 1989 }, (_, index) => 1990 + index);

  // Generate an array of years from 1990 to the current year in descending order
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, index) => currentYear - index);

  useEffect(() => {
    setSelectedYear(new Date().getFullYear().toString());
    setEducationForm(props.data);
  },[]);

  // Initialize with education data prop when the component mounts or the prop changes
  useEffect(() => {
    setEducationForm(props.data); 
  }, [props.data]);

  // Handle changes to the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = {
        ...educationForm,
        [name]: value,
    }
    setEducationForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // setEducationForm(updated)
    props.onUpdate(updated);
  };
  
  // Handle changes to the dropdowns
  const handleAutoCompleteChange = (e, name) => {
    const { innerText } = e.target;
    let updated = {
        ...educationForm,
        [name]: innerText,
    }
    // setEducationForm(prevState => ({
    //     ...educationForm,
    //     [name]: innerText,
    // }));
    setEducationForm(updated)
    props.onUpdate(updated);
  };

  // Call onUpdate (passed from parent) with the updated education object
  const handleUpdate = () => {
      props.onUpdate(educationForm);
  };

  // Function you want the parent to call
/* //   const processEducationList = () => {
//     console.log('Processing education list...');
//     setEducationList(prevList => [...prevList, educationForm]);
//     props.addForm([...educationList, educationForm]);
//   }

//   const getEducationList = () => {
//     setEducationList(prevList => [...prevList, educationForm]);
//     return [...educationList, educationForm];
//   }

    // Use useImperativeHandle to expose functions to the parent component
    // useImperativeHandle(ref, ()=>({
    //     getEducationList,
    // }))

//   useImperativeHandle(ref, ()=>({
//     handleUpdate,
//   })) */

  return (
      <>
        <Fragment>
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
                    {`Education ${props.indexValue+1}`}
                </Typography>
            </Grid>

            {/* -------- Row 1 - Degree ------------- */}
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
                        id="degree"
                        label="Degree"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Degree / Field of Study"
                        value={educationForm.degree}
                        // onChange={(e) => {
                        //     setEducationForm({
                        //         ...educationForm,
                        //         degree: e.target.value,
                        //     });
                        // }}
                        name="degree"
                        onChange={handleChange}
                        style={{ width: "100%", paddingTop: "5px"}}
                    />
                </Grid>
            </Grid>

            {/* -------- Row 2 - School------------- */}
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
                        id="school"
                        label="School"
                        placeholder="University / School / Institute"
                        value={educationForm.school}
                        // onChange={(e) => {
                        //     setEducationForm({
                        //         ...educationForm,
                        //         school: e.target.value,
                        //     });
                        // }}
                        name="school"
                        onChange={handleChange}
                        style={{ width: "100%", paddingTop: "5px", color:"#000" }}
                    />
                </Grid>
            </Grid>

            {/* -------- Row 3 - City & Country------------- */}
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
                        value={educationForm.city}
                        // onChange={(e) => {
                        //     setEducationForm({
                        //         ...educationForm,
                        //         city: e.target.value,
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
                        value={educationForm.country}
                        // onChange={(e) => {
                        //     setEducationForm({
                        //         ...educationForm,
                        //         country: e.target.value,
                        //     });
                        // }}
                        name="country"
                        onChange={handleChange}
                        style={{ width: "100%", paddingTop: "5px" }}
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
                        // className={classes.category_dropdown}
                        id="start_month"
                        name="start_month"
                        options={months}
                        getOptionLabel={(option) => option}
                        value={educationForm.start_month}
                        disablePortal
                        size="small"
                        disabledItemsFocusable
                        // onChange={(e,v)=>{
                        //     console.log(v)
                        //     console.log( e.target.value)
                        //     setEducationForm({
                        //         ...educationForm,
                        //         // start_month: e.target.value,
                        //         start_month: v == null ? "" : v
                        //     });
                        // }}
                        onChange={(e,v)=>{handleAutoCompleteChange(e, "start_month")}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Month"
                                styles={{ color: "red" }}
                                value={educationForm.start_month}
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
                        // className={classes.category_dropdown}
                        id="start_year"
                        name="start_year"
                        options={years.map(year => year.toString())}
                        getOptionLabel={(option) => option}
                        // value={selectedYear}
                        value={educationForm.start_year}
                        disablePortal
                        size="small"
                        disabledItemsFocusable
                        // onChange={(e,v)=>{
                        //     setEducationForm({
                        //         ...educationForm,
                        //         // start_year: e.target.value,
                        //         start_year: v == null ? "" : v
                        //     });
                        // }}
                        onChange={(e,v)=>{handleAutoCompleteChange(e, "start_year")}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Month"
                                styles={{ color: "red" }}
                                value={educationForm.start_year}
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
                        // className={classes.category_dropdown}
                        id="end_month"
                        name="end_month"
                        options={months}
                        getOptionLabel={(option) => option}
                        value={educationForm.end_month}
                        disablePortal
                        // sx={{ width: 600 }}
                        size="small"
                        disabledItemsFocusable
                        // onChange={(e,v)=>{
                        //     setEducationForm({
                        //         ...educationForm,
                        //         // end_month: e.target.value,
                        //         end_month: v == null ? "" : v
                        //     });
                        // }}
                        onChange={(e,v)=>{handleAutoCompleteChange(e, "end_month")}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Month"
                                styles={{ color: "red" }}
                                value={educationForm.end_month}
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
                        // className={classes.category_dropdown}
                        id="end_year"
                        name="end_year"
                        options={years.map(year => year.toString())}
                        getOptionLabel={(option) => option}
                        // value={selectedYear}
                        value={educationForm.end_year}
                        disablePortal
                        size="small"
                        disabledItemsFocusable
                        // onChange={(e,v)=>{
                        //     setEducationForm({
                        //         ...educationForm,
                        //         // end_year: e.target.value,
                        //         end_year: v == null ? "" : v
                        //     });
                        // }}
                        onChange={(e,v)=>{handleAutoCompleteChange(e, "end_year")}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Month"
                                styles={{ color: "red" }}
                                value={educationForm.end_year}
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
                                // onClick={()=>{processEducationList();}}
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
});

export default withStyles(styleSheet)(EducationForm);
