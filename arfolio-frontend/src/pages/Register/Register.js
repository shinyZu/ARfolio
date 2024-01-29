import React, { useState, useEffect } from "react";
import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import RegisterForm from "../../components/Register/RegisterForm";

const Register = (props) => {
  const { classes, onLogin } = props;

  return (
    <div className={classes.login_container_1}>
      <RegisterForm onLogin={onLogin} />
    </div>
  );
};

export default withStyles(styleSheet)(Register);
