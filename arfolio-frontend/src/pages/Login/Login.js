import React, { useState, useEffect } from "react";
import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import LoginForm from "../../components/Login/LoginForm";

const Login = (props) => {
  const { classes, onLogin } = props;
  return (
    <div className={classes.login_container_1}>
      <LoginForm onLogin={onLogin} />
    </div>
  );
};
export default withStyles(styleSheet)(Login);