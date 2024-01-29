import React, { Component, Fragment, useState } from "react";
import { Routes, Route, useNavigate, Link, NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

const Navbar2 = (props) => {
  const [value, setValue] = useState("");
  //   const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleCustomerLogout = () => {
    console.log("logged out");
    navigate("/");
  };

  function changePage(e) {
    // console.log(e);
    // console.log("Page Changed...");
    setValue(e.target.innerText);
  }

  const { classes } = props;

  const navLinkStyle = ({ isActive }) => {
    return {
      color: isActive ? "rgb(244 249 0)" : "normal",
    };
  };

  return (
    <Box className={classes.nav__bar} style={{ backgroundColor: "#0c5199" }}>
      <Tabs value={value} onChange={changePage} className={classes.nav__tabs}>
        <div className={classes.nav_left}>
          <Link to="/" className={classes.nav__text}>
            <Tab
              icon={<HomeIcon />}
              className={classes.nav__text}
              label="Home"
            />
          </Link>

          <HashLink smooth to="/#garage" className={classes.nav__text}>
            <Tab
              icon={<DirectionsCarIcon />}
              className={classes.nav__text}
              label="Cars"
            />
          </HashLink>

          <NavLink
            smooth
            to="/my_bookings"
            className={classes.nav__text}
            style={navLinkStyle}
          >
            <Tab
              icon={<FactCheckIcon />}
              className={classes.nav__text}
              label="My Bookings"
            />
          </NavLink>
        </div>
        <div className={classes.nav__right}>
          <NavLink
            smooth
            to="/my_profile"
            className={classes.nav__text}
            style={navLinkStyle}
          >
            <Tab
              icon={<AccountCircleIcon />}
              className={classes.nav__text}
              label="My Profile"
            />
          </NavLink>
          <Tab
            icon={<LogoutIcon />}
            className={classes.nav__text}
            label="Logout"
            onClick={handleCustomerLogout}
          />
        </div>
      </Tabs>
    </Box>
  );
};

export default withStyles(styleSheet)(Navbar2);
