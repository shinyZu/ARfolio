import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import styles from "./LoginForm.module.css";
import MySnackBar from "../../components/common/MySnackBar/MySnackbar";

import LoginService from "../../services/LoginService";
import {jwtDecode} from "jwt-decode";

const LoginForm = (props) => {
  const { classes, onLogin } = props;
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [isDisabled, setIsDisabled] = useState(true);

  const [openAlert, setOpenAlert] = useState({
    open: false,
    alert: "",
    severity: "warning",
    variant: "",
  });

  const [isEmailValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    // Your validation logic for the email field
    const isValidEmail = /^[A-z|0-9]{4,}@(gmail)(.com|.lk)$/.test(emailValue);
    setEmailValid(isValidEmail);
    setLoginFormData({
      ...loginFormData,
      email: emailValue,
    });
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    // Your validation logic for the password field
    const isValidPassword = /^[A-z|0-9|@]{8,}$/.test(passwordValue);
    setPasswordValid(isValidPassword);
    setLoginFormData({
      ...loginFormData,
      password: passwordValue,
    });
  };

  const handleSubmit = async (e) => {
    console.log(loginFormData);
    console.log(isEmailValid && isPasswordValid);

    let res = await LoginService.login(loginFormData);
    console.log(res);

    if (res.status === 200) {
      if (res.data.data) {
        console.log(res.data.data.access_token);
        localStorage.setItem(
          "token",
          JSON.stringify(res.data.data.access_token)
        );
        localStorage.setItem(
          "refresh_token",
          JSON.stringify(res.data.data.refresh_token)
        );
        // alert(res.data.message);
        checkIfCustomerOrAdmin(res.data.data.access_token);
        // props.onLogin(isEmailValid && isPasswordValid);
        // navigate("/home");
      }
    } else {
      // TOD0
      // alert(res.response.data.message);
      setOpenAlert({
        open: true,
        alert: res.response.data.message,
        severity: "error",
        variant: "standard",
      });
    }
  };

  const checkIfCustomerOrAdmin = (token) => {
      const decodedToken = jwtDecode(token);
      if (decodedToken.user_role === "Admin") {
        props.onLogin(true, decodedToken.user_role);
        // navigate("/admin/panel");
      } else {
        props.onLogin(true, decodedToken.user_role);
        // navigate("/home");
      }
  };

  const openRegisterForm = (e) => {
    console.log(e);
  };

  return (
    <div id="login-form" className={classes.login_container}>
      <div className={styles.glass_container}>
        <h1 className={classes.login_text}>
          {/* Unlock the Access to Quality Education Resources! */}
          LOGIN
        </h1>

        <ValidatorForm className="pt-2" /* onSubmit={handleSubmit} */>
          <TextValidator
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            fullWidth
            required={true}
            style={{ marginBottom: "20px", color:"#fff" }}
            validators={["matchRegexp:^[A-z|0-9]{4,}@(gmail)(.com|.lk)$"]}
            errorMessages={["Invalid email address"]}
            value={loginFormData.email}
            onChange={handleEmailChange}
          />
          <TextValidator
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            required={true}
            style={{ marginBottom: "20px" }}
            validators={["matchRegexp:^[A-z|0-9|@]{8,}$"]}
            errorMessages={["Must have atleast 8 characters"]}
            value={loginFormData.password}
            onChange={handlePasswordChange}
          />
        </ValidatorForm>
        <br />
        <div className={classes.login_footer}>
          <button
            disabled={!(isEmailValid && isPasswordValid)}
            className={
              isEmailValid && isPasswordValid
                ? classes.btn_login
                : classes.btn_login_disabled
            }
            type="submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Login
          </button>
          <small className={classes.login_footer_text}>
            Not a member?{" "}
            <u>
              <Link to="/register" className={classes.txt_register}>
                Register
              </Link>
            </u>
          </small>
        </div>
      </div>
      <MySnackBar
        open={openAlert.open}
        alert={openAlert.alert}
        severity={openAlert.severity}
        variant={openAlert.variant}
        onClose={() => {
          setOpenAlert({ open: false });
        }}
      />
    </div>
  );
};

// export default LoginForm;
export default withStyles(styleSheet)(LoginForm);
