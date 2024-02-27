import React, { useState, useEffect, Fragment } from "react";
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

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import {jwtDecode} from "jwt-decode";

import UserService from "../../../services/UserService";
import LinkHubService from "../../../services/LinkHubService";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const ImportantLinks = (props) => {
  const { classes } = props;
  const navigate = useNavigate();

  const location = useLocation();

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

  const [linksForm, setLinksForm] = useState({
    linkedin: "",
    website: "",
    github: "",
    twitter: "",
    instagram: "",
    spotify: "",
    facebook: "",
  });

//   const [linksForm, setLinksForm] =  useState([{id:0,}]);

  const [user, setUser] = useState([]);
  const [updatedExperienceList, setUpdatedExperienceList] = useState([{id:0,}]);

  useEffect(()=>{
    getSingleUserById();
  },[])

  const getSingleUserById = async (i) => {

    let decodedToken = decodeToken();
    let res = await UserService.getUserById(decodedToken.user_id);

    if (res.status == 200) {
      if (res.data.data != []) {
        console.log(res.data.data);
        setUser(res.data.data);

        let userLinks = res.data.data[0].Links[0]
        
        setLinksForm({
            linkedin: userLinks.linkedin,
            website: userLinks.website,
            github: userLinks.github,
            twitter: userLinks.twitter,
            instagram: userLinks.instagram,
            spotify: userLinks.spotify,
            facebook: userLinks.facebook,
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

  console.log(linksForm)

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

            {/* ----------Links--------------------- */}

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
                {/* ------------------ Link Details ----------------------- */}

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
                            Important Links
                        </Typography>
                    </Grid>

                    {/* -------- Row 1 - Linkedin ------------- */}
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
                                id="linkedin_url"
                                label="Linkedin"
                                placeholder="Linkedin Profile URL"
                                InputLabelProps={{ shrink: true }}
                                value={linksForm.linkedin}
                                onChange={(e) => {
                                    setLinksForm({
                                        ...linksForm,
                                        linkedin: e.target.value,
                                    });
                                }}
                                style={{ width: "100%", paddingTop: "5px"}}
                            />
                        </Grid>
                    </Grid>

                    {/* -------- Row 2 - Website ------------- */}
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
                                id="website_url"
                                label="Personal Website"
                                placeholder="Personal Website URL"
                                InputLabelProps={{ shrink: true }}
                                value={linksForm.website}
                                onChange={(e) => {
                                    setLinksForm({
                                        ...linksForm,
                                        website: e.target.value,
                                    });
                                }}
                                style={{ width: "100%", paddingTop: "5px"}}
                            />
                        </Grid>
                    </Grid>

                    {/* -------- Row 3 - Github ------------- */}
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
                                id="github_url"
                                label="Github"
                                placeholder="Github Profile URL"
                                InputLabelProps={{ shrink: true }}
                                value={linksForm.github}
                                onChange={(e) => {
                                    setLinksForm({
                                        ...linksForm,
                                        github: e.target.value,
                                    });
                                }}
                                style={{ width: "100%", paddingTop: "5px"}}
                            />
                        </Grid>
                    </Grid>

                    {/* -------- Row 4 - Twitter ------------- */}
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
                                id="twitter_url"
                                label="Twitter"
                                placeholder="Twitter Profile URL"
                                InputLabelProps={{ shrink: true }}
                                value={linksForm.twitter}
                                onChange={(e) => {
                                    setLinksForm({
                                        ...linksForm,
                                        twitter: e.target.value,
                                    });
                                }}
                                style={{ width: "100%", paddingTop: "5px"}}
                            />
                        </Grid>
                    </Grid>

                    {/* -------- Row 5 - Instagram ------------- */}
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
                                id="instagram_url"
                                label="Instagram"
                                placeholder="Instagram Profile URL"
                                InputLabelProps={{ shrink: true }}
                                value={linksForm.instagram}
                                onChange={(e) => {
                                    setLinksForm({
                                        ...linksForm,
                                        instagram: e.target.value,
                                    });
                                }}
                                style={{ width: "100%", paddingTop: "5px"}}
                            />
                        </Grid>
                    </Grid>

                    {/* -------- Row 6 - Facebook ------------- */}
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
                                id="instagram_url"
                                label="Facebook"
                                placeholder="Facebook Profile URL"
                                InputLabelProps={{ shrink: true }}
                                value={linksForm.facebook}
                                onChange={(e) => {
                                    setLinksForm({
                                        ...linksForm,
                                        facebook: e.target.value,
                                    });
                                }}
                                style={{ width: "100%", paddingTop: "5px"}}
                            />
                        </Grid>
                    </Grid>

                    {/* -------- Row 7 - Spotify ------------- */}
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
                                id="instagram_url"
                                label="Spotify"
                                placeholder="Spotify Profile URL"
                                InputLabelProps={{ shrink: true }}
                                value={linksForm.spotify}
                                onChange={(e) => {
                                    setLinksForm({
                                        ...linksForm,
                                        spotify: e.target.value,
                                    });
                                }}
                                style={{ width: "100%", paddingTop: "5px"}}
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
                        label="Back"
                        size="small"
                        variant="outlined"
                        type="button"
                        style={{ width: "20%", height: "100%", marginRight:"2vw" }}
                        className={classes.btn_back}
                        onClick={() => {
                            navigate("/projects");
                        }}
                    />

                    <MyButton
                        label="Process"
                        size="small"
                        variant="outlined"
                        type="button"
                        style={{ width: "20%", height: "100%" }}
                        className={classes.btn_process}
                        onClick={() => {
                            navigate("/process-arfolio");
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
export default withStyles(styleSheet)(ImportantLinks);
