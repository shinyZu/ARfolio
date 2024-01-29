import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

const Footer = (props) => {
  const { classes } = props;
  return (
    <>
      <Grid
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className={classes.footer_container}
        justifyContent="center"
      >
        <Grid
          container
          item
          xl={3}
          lg={3}
          md={3}
          sm={3}
          xs={12}
          className={classes.footer_container_1}
          justifyContent="space-around"
          alignItems="center"
        >
          <FacebookIcon fontSize="large" className={classes.icon} />
          <TwitterIcon fontSize="large" className={classes.icon} />
          <InstagramIcon fontSize="large" className={classes.icon} />
          <YouTubeIcon fontSize="large" className={classes.icon} />
        </Grid>
        <Grid
          container
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className={classes.footer_container_2}
          justifyContent="center"
        >
          <small className={classes.footer_text}>
            {" "}
            Copyright 2024 ARfolio, All Rights Reserved
          </small>
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styleSheet)(Footer);
