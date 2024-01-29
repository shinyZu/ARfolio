import React from "react";

import CustomerNavbar from "../Navbar/CustomerNavbar";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

const Header = (props) => {
  const { classes } = props;
  return (
    <div id="header">
      <CustomerNavbar handleLogin={props.handleLogin} />
    </div>
  );
};

export default withStyles(styleSheet)(Header);
