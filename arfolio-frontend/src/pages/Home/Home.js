import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Header from "../../components/Header/Header";
import MyButton from "../../components/common/MyButton/MyButton";
import Footer from "../../components/Footer/Footer";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import {jwtDecode} from "jwt-decode";

const Home = (props) => {
  const { classes } = props;
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState([]);

  useEffect(() => {
    console.log("---handling login in Home-----");
    // let token = localStorage.getItem("token");
    // console.log(token);
    // if (token) {
    //   props.handleLogin(true);
    //   // navigate("/home");
    // } else {
    //   props.handleLogin(false);
    //   // navigate("/home");
    // }

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      let user_role = decodedToken.user_role;
      setIsLoggedIn(true);

      if (user_role === "Admin") {
        console.log("-------is Admin in Home------");
        props.handleLogin(true, user_role);
        // navigate("/admin/panel");
      } else {
        console.log("-------is Customer in Home------");
        props.handleLogin(true, user_role);
        // navigate("/home");
      }
    } else {
      console.log("-------Both in Home------");
      setIsLoggedIn(false);
      props.handleLogin(false, "Both");
    }
  });

  return (
    <>
      <div id="home">
        <Header handleLogin={props.handleLogin} />
        <Box sx={{ flexGrow: 1 }} className={classes.box_container}>
          {/* --------First Container From Top--------------- */}
          <Grid
            container
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className={classes.first_container}
          >
            <Grid container className={classes.container_1}>
              {/* ----Left Container ---------- */}

              <Grid item xs={6} className={classes.container_1_left}>
                <Grid item xs={12} className={classes.container_1_left_1}>
                  <Typography variant="h3" className={classes.txt_title}>
                    ARfolio – The New Dimension of Professional Presence....
                  </Typography>
                </Grid>

                <Grid item xs={12} className={classes.container_1_left_2}>
                  <Typography
                    variant="h7"
                    className={classes.txt_title_description}
                  >
                      Step into the future with ARfolio, the platform where augmented reality breathes life into your professional story. 
                      Our innovative AR portfolio cards open a window to a world of possibilities, granting instant access to a deeper
                      understanding of your professional narrative. Say goodbye to the traditional resumes and business cards and hello to a captivating, 
                      immersive experience. With ARfolio, let your first impression resonate in an unforgettable three-dimensional showcase.
                  </Typography>
                </Grid>

                <Grid item xs={12} className={classes.container_1_left_3}>
                  <Link to={isLoggedIn ? "/basic" : "/login"}>
                  {/* <Link to={isLoggedIn ? { pathname: "/basic", state:  { proceedUpdateUser: false } } : "/login"}> */}
                    <MyButton
                      label={isLoggedIn ? "Start Now" : "Login"}
                      size="small"
                      variant="outlined"
                      type="button"
                      className={classes.btn_start_now}
                    />
                  </Link>
                </Grid>
              </Grid>

              {/* ----Right Container ---------- */}

              <Grid container item xs={5} className={classes.container_1_right}>
                <Grid
                  item
                  xs={12}
                  className={classes.container_1_right_1}
                ></Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {/* ------------- Footer -------------- */}
        <Footer />
      </div>
    </>
  );
};

export default withStyles(styleSheet)(Home);
