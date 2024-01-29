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

  const [projectForm, setProjectForm] = useState({
    project_title: "",
    project_link: "",
    start_month: "",
    start_year: "",
    end_month: "",
    end_year: "",
  });

  const [selectedMonth, setSelectedMonth] = useState('');

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const [selectedYear, setSelectedYear] = useState('');

  // Generate an array of years from 1990 to the current year
  const years = Array.from({ length: new Date().getFullYear() - 1989 }, (_, index) => 1990 + index);

  useEffect(() => {
      console.log(props)
    // Set the current year as the default selected year
    setSelectedYear(new Date().getFullYear().toString());
  }, []); // Run only once on component mount

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
                style={{marginBottom:"2vh"}}
            >
                <Typography variant="h5" className={classes.sub_title} style={{color:"#40739e", marginTop:"2vh"}}>
                    {`Project ${props.indexValue}`}
                </Typography>
            </Grid>

            {/* -------- Row 1 - Title ------------- */}
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
                        label="Title"
                        placeholder="Project Title"
                        InputLabelProps={{ shrink: true }}
                        value={projectForm.project_title}
                        onChange={(e) => {
                            setProjectForm({
                                ...projectForm,
                                project_title: e.target.value,
                            });
                        }}
                        style={{ width: "100%", paddingTop: "5px"}}
                    />
                </Grid>
            </Grid>

            {/* -------- Row 2 -  Link------------- */}
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
                        id="project_link"
                        label="Link"
                        placeholder="Project Link"
                        value={projectForm.project_link}
                        onChange={(e) => {
                            setProjectForm({
                                ...projectForm,
                                project_link: e.target.value,
                            });
                        }}
                        style={{ width: "100%", paddingTop: "5px", color:"#000" }}
                    />
                </Grid>
            </Grid>

            {/* -------- Row 3 - Start Date------------- */}
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
                        disablePortal
                        id="start_month"
                        options={months}
                        value={selectedMonth}
                        // getOptionLabel={(option) => option.categoryTitle}
                        // inputValue={categoryName}
                        // sx={{ width: 600 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Month"
                                styles={{ color: "red" }}
                            />
                        )}
                        size="small"
                        disabledItemsFocusable
                        onChange={(e) => {
                            setProjectForm({
                                ...projectForm,
                                start_month: e.target.value,
                            });
                        }}
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
                        disablePortal
                        id="start_year"
                        options={years.map(year => year.toString())}
                        value={selectedYear}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Year"
                                styles={{ color: "red" }}
                            />
                        )}
                        size="small"
                        disabledItemsFocusable
                        onChange={(e)=>{
                            setProjectForm({
                                ...projectForm,
                                start_year: e.target.value,
                            });
                        }}
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

            {/* -------- Row 4 - End Date------------- */}
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
                        disablePortal
                        id="end_month"
                        options={months}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Month"
                                styles={{ color: "red" }}
                            />
                        )}
                        size="small"
                        disabledItemsFocusable
                        onChange={(e)=>{
                            setProjectForm({
                                ...projectForm,
                                end_month: e.target.value,
                            });
                        }}
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
                        disablePortal
                        id="end_year"
                        options={years.map(year => year.toString())}
                        value={selectedYear}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Year"
                                styles={{ color: "red" }}
                            />
                        )}
                        size="small"
                        disabledItemsFocusable
                        onChange={(e)=>{
                            setProjectForm({
                                ...projectForm,
                                end_year: e.target.value,
                            });
                        }}
                    />
                </Grid>

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
                                onClick={() => {
                                    console.log("delete education");
                                }}
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
