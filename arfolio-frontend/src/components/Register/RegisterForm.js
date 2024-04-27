import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import styles from "./RegisterForm.module.css";
import MySnackBar from "../../components/common/MySnackBar/MySnackbar";

import UserService from "../../services/UserService";
import {jwtDecode} from "jwt-decode";

const RegisterForm = (props) => {
  const { classes, onLogin } = props;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registerFormData, setRegisterFormData] = useState({
    email: "",
    password: "",
    city: "",
    contact_no: "",
    user_role: "Customer",
    title: "",
    first_name: "",
    last_name: "",
    job_title: "",
    country: "",
    gender: "",
  });

  const [openAlert, setOpenAlert] = useState({
    open: false,
    alert: "",
    severity: "warning",
    variant: "",
  });

  const [isEmailValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [isContactValid, setContactValid] = useState(false);
  const [isAddressValid, setAddressValid] = useState(false);
  const [isCountryValid, setCountryValid] = useState(false);
  const [isTitleValid, setTitleValid] = useState(false);
  const [isFirstNameValid, setFirstNameValid] = useState(false);
  const [isLastNameValid, setLastNameValid] = useState(false);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    // Your validation logic for the email field
    const isValidEmail = /^[A-z|0-9]{4,}@(gmail)(.com|.lk)$/.test(emailValue);
    setEmailValid(isValidEmail);
    setRegisterFormData({
      ...registerFormData,
      email: emailValue,
    });
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    const isValidPassword = /^[A-z|0-9|@]{8,}$/.test(passwordValue);
    setPasswordValid(isValidPassword);
    setRegisterFormData({
      ...registerFormData,
      password: passwordValue,
    });
  };

  const handleAddressChange = (e) => {
    const addressValue = e.target.value;
    const isValidAddress = /^[A-z|0-9|-|.| ]{4,}$/.test(addressValue);
    setAddressValid(isValidAddress);
    setRegisterFormData({
      ...registerFormData,
      city: addressValue,
    });
  };

  const handleContactNoChange = (e) => {
    const contactValue = e.target.value;
    const isValidContact = /^[0-9]{10}$/.test(contactValue);
    setContactValid(isValidContact);
    setRegisterFormData({
      ...registerFormData,
      contact_no: contactValue,
    });
  };

  const handleSubmit = async (e) => {
    console.log(registerFormData);

    let res = await UserService.registerUser(registerFormData);
    console.log(res);

    if (res.status === 201) {
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
      } else {
        props.onLogin(true, decodedToken.user_role);
      }
  };

  const openLoginForm = (e) => {
    console.log(e);
  };

  return (
    // <div className={styles.login_container}>
    <div id="register-form" className={classes.login_container}>
      <div className={styles.glass_container}>
        <h1 className={classes.login_text}>
          REGISTER
          {/* Discover the Tools for Academic Success...! */}
        </h1>
        <ValidatorForm className="pt-2" /* onSubmit={handleSubmit} */>
          <TextValidator
              label="Title"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              required={true}
              style={{ marginBottom: "20px" }}
              validators={["matchRegexp:^[A-z|0-9|-|.| ]{2,}$"]}
              errorMessages={["Must have atleast 2 characers"]}
              value={registerFormData.title}
              onChange={(e,v)=>{
                const value = e.target.value;
                const isValidTitle = /^[A-z|0-9|-|.| ]{4,}$/.test(value);
                setTitleValid(isValidTitle);
                setRegisterFormData({
                  ...registerFormData,
                  title: value,
                });
              }}
          />
          <TextValidator
              label="First Name"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              required={true}
              style={{ marginBottom: "20px" }}
              validators={["matchRegexp:^[A-z|0-9|-|.| ]{4,}$"]}
              errorMessages={["Must have atleast 8 characters"]}
              value={registerFormData.first_name}
              onChange={(e,v)=>{
                const value = e.target.value;
                const isValidFirstName = /^[A-z|0-9|-|.| ]{4,}$/.test(value);
                setFirstNameValid(isValidFirstName);
                setRegisterFormData({
                  ...registerFormData,
                  first_name: value,
                });
              }}
          />
          <TextValidator
              label="Last Name"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              required={true}
              style={{ marginBottom: "20px" }}
              validators={["matchRegexp:^[A-z|0-9|-|.| ]{4,}$"]}
              errorMessages={["Must have atleast 8 characters"]}
              value={registerFormData.last_name}
              onChange={(e,v)=>{
                const value = e.target.value;
                const isValidLastName = /^[A-z|0-9|-|.| ]{4,}$/.test(value);
                setLastNameValid(isValidLastName);
                setRegisterFormData({
                  ...registerFormData,
                  last_name: value,
                });
              }}
            />
            <TextValidator
              label="Email"
              type="email"
              variant="outlined"
              size="small"
              fullWidth
              required={true}
              style={{ marginBottom: "20px" }}
              validators={["matchRegexp:^[A-z|0-9]{4,}@(gmail)(.com|.lk)$"]}
              errorMessages={["Invalid email address"]}
              value={registerFormData.email}
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
              value={registerFormData.password}
              onChange={handlePasswordChange}
            />
            <TextValidator
              label="City"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              required={true}
              style={{ marginBottom: "20px" }}
              validators={["matchRegexp:^[A-z|0-9|-|.| ]{4,}$"]}
              errorMessages={["Must have atleast 8 characters"]}
              value={registerFormData.city}
              onChange={handleAddressChange}
            />
            <TextValidator
              label="Country"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              required={true}
              style={{ marginBottom: "20px" }}
              validators={["matchRegexp:^[A-z|0-9|-|.| ]{4,}$"]}
              errorMessages={["Must have atleast 8 characters"]}
              value={registerFormData.country}
              onChange={(e,v)=>{
                const value = e.target.value;
                const isValidCountry = /^[A-z|0-9|-|.| ]{4,}$/.test(value);
                setCountryValid(isValidCountry);
                setRegisterFormData({
                  ...registerFormData,
                  country: value,
                });
              }}
            />
            <TextValidator
              label="Contact No"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              required={true}
              style={{ marginBottom: "20px" }}
              validators={["matchRegexp:^[0-9]{10}$"]}
              errorMessages={["Invalid contact no"]}
              value={registerFormData.contact_no}
              onChange={handleContactNoChange}
            />
            {/* <TextValidator
              label="Admin Verification Code"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              // required={true}
              // style={{ marginBottom: "20px" }}
              validators={["matchRegexp:^[0-9]*6$"]}
              errorMessages={["Invalid verification code."]}
              // value={loginFormData.email}
              // onChange={(e) => {
              //   setLoginFormData({
              //     ...loginFormData,
              //     email: e.target.value,
              //   });
              // }}
            /> */}
        </ValidatorForm>
        <br />
        <div className={classes.register_footer}>
          <button
            disabled={
              !(
                isTitleValid &&
                isFirstNameValid &&
                isLastNameValid &&
                isEmailValid &&
                isPasswordValid &&
                isAddressValid &&
                isCountryValid &&
                isContactValid
              )
            }
            className={
              isTitleValid &&
              isFirstNameValid &&
              isLastNameValid &&
              isEmailValid &&
              isPasswordValid &&
              isAddressValid &&
              isCountryValid &&
              isContactValid
                ? classes.btn_register
                : classes.btn_register_disabled
            }
            type="submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Register
          </button>
          <small className={classes.register_footer_text}>
            Already a member?{" "}
            <u>
              <Link to="/login" className={classes.txt_login}>
                Login
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

export default withStyles(styleSheet)(RegisterForm);
