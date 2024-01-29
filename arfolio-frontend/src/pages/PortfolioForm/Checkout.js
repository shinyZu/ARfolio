import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";

import Header from "../../components/Header/Header";
import MyTextField from "../../components/common/MyTextField/MyTextField";
import MyButton from "../../components/common/MyButton/MyButton";
import SummaryItem from "../../components/common/SummaryItem/SummaryItem";
import CartTotals from "../../components/common/CartTotals/CartTotals";
import Footer from "../../components/Footer/Footer";
import MySnackBar from "../../components/common/MySnackBar/MySnackbar";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import BillingService from "../../services/BillingService";
import OrderService from "../../services/OrderService";
import jwtDecode from "jwt-decode";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Checkout = (props) => {
  const { classes } = props;
  const navigate = useNavigate();

  const location = useLocation();
  const receivedData = location.state; // The data sent from the previous page

  // Billing & Payment Info
  const [billingInfoForm, setBillingInfoForm] = useState({
    billing_id: "",
    first_name: "",
    last_name: "",
    country: "",
    province: "",
    city: "",
    street_address: "",
    zip_code: "",
    phone_no: "",
    card_payment: true,
    cash_on_delivery: false,
    card_no: "",
    card_holder_name: "",
    card_expire_date: "",
    card_cvv: "",
    billing_status: "Pending",
    coupon_price: "",
    user_id: "",
  });

  const [billingDetailsFound, setBillingDetailsFound] = useState(false);

  //   Payment Info
  const [paymentType, setPaymentType] = useState("card");
  const [checked, setChecked] = useState(false);

  //   Order Summary
  const [finalSubtotal, setFinalSubTotal] = useState(0);
  const [cart, setCart] = useState(() => {
    const savedCartItems = localStorage.getItem("cart");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // Order Details
  // const [orderDetails, setOrderDetails] = useState({});

  // Place Order btn
  const [isDisabled, setIsDisabled] = useState(true);

  // Display Payment Details Form
  const [isVisible, setIsVisible] = useState(true);

  // Totals
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);

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

  useEffect(() => {
    getBillingDetailsOfTheLoggedUser();
  }, []);

  useEffect(() => {
    let isFilled = areAllValuesFilled();
    if (isFilled) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    // }
  }, [billingInfoForm]);

  useEffect(() => {
    let final_subtotal = 0;
    for (let item of cart) {
      final_subtotal += item.subtotal;
      console.log(final_subtotal);
      setFinalSubTotal(final_subtotal);
    }
  }, [finalSubtotal]);

  // Function to check if all values in the 'billingInfoForm' object are filled
  const areAllValuesFilled = () => {
    const excludedKeys = [
      "_id",
      "billing_id",
      "billing_status",
      "card_payment",
      "cash_on_delivery",
      "coupon_price",
      "user_id",
      "__v",
    ];
    for (const key in billingInfoForm) {
      if (!excludedKeys.includes(key)) {
        console.log(key + " : " + billingInfoForm[key]);
        if (!billingInfoForm[key]) {
          return false; // If any non-excluded value is falsy, return false
        }
      }
    }
    return true; // All non-excluded values are filled
  };

  const handlePaymentType = (event) => {
    console.log(event.target.value);
    setPaymentType(event.target.value);
  };

  const handleCheckBox = (event) => {
    console.log(checked);
    setChecked(event.target.checked);
  };

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

  const getBillingDetailsOfTheLoggedUser = async () => {
    console.log("getBillingDetailsOfTheLoggedUser");
    let res = await BillingService.getAllByCustomerId();

    if (res.status === 200) {
      let customerBillingInfo = res.data.data;
      // console.log(customerBillingInfo);
      setBillingInfoForm(customerBillingInfo);
      setBillingDetailsFound(true);
      setIsDisabled(false);
    } else {
      console.log("No any billing details found for this user.");
      setBillingDetailsFound(false);
    }

    // TODO
    // Get user_id from token
    let decodedToken = decodeToken();
    console.log(decodedToken.user_id);

    setBillingInfoForm((prevData) => ({
      ...prevData, // Copy all the properties from the previous state
      user_id: decodedToken.user_id, // Update the 'user_id' with the new value
      coupon_price: receivedData.coupon,
    }));
    console.log(billingInfoForm);
  };

  const placeOrder = async () => {
    console.log("placeOrder");
    // TODO: get the user id from token and set here
    let decodedToken = decodeToken();
    console.log(decodedToken.user_id);

    setBillingInfoForm((prevData) => ({
      ...prevData,
      user_id: decodedToken.user_id,
    }));

    console.log(billingDetailsFound);
    console.log(billingInfoForm);

    if (billingDetailsFound) {
      console.log("---------1-----------");
      // update billing info
      console.log(billingInfoForm.card_payment);
      console.log(billingInfoForm.cash_on_delivery);
      console.log(billingInfoForm);
      let res1 = await BillingService.updateBillingDetails(billingInfoForm);
      if (res1.status === 200) {
        console.log("---------2-----------");
        console.log("Billing details updated successfully!");
        // alert(res1.data.message);
        // setOpenAlert({
        //   open: true,
        //   alert: res1.data.message,
        //   severity: "success",
        //   variant: "standard",
        // });
      } else {
        console.log("---------3-----------");
        // alert(res1.response.data.message);
        // setOpenAlert({
        //   open: true,
        //   alert: res1.response.data.message,
        //   severity: "error",
        //   variant: "standard",
        // });
        return;
      }
    } else if (!billingDetailsFound && areAllValuesFilled()) {
      console.log("---------4-----------");
      // save billing info

      let res2 = await BillingService.saveBillingDetails(billingInfoForm);
      if (res2.status === 201) {
        console.log("---------5-----------");
        console.log("Billing details saved successfully!");
        // alert(res2.data.message);
        setOpenAlert({
          open: true,
          alert: res2.data.message,
          severity: "success",
          variant: "standard",
        });
      } else {
        console.log("---------6-----------");
        // alert(res2.response.data.message);
        setOpenAlert({
          open: true,
          alert: res2.response.data.message,
          severity: "error",
          variant: "standard",
        });
        return;
      }
    }

    // create order details list
    let orderDetailsList = [];
    const savedCartItems = localStorage.getItem("cart");
    for (const item of JSON.parse(savedCartItems)) {
      let obj = {
        st_code: item.st_code,
        order_qty: item.qty,
      };
      orderDetailsList.push(obj);
    }
    console.log(orderDetailsList);

    // create order details
    let orderData = {
      order_date: new Date(),
      order_cost: calculateOrdeCost(),
      order_status: "Pending",
      user_id: decodeToken().user_id, // TODO
      order_details: orderDetailsList,
    };
    console.log(orderData);

    console.log("---------7-----------");
    console.log("----now lets save order-------");

    setConfirmDialog({
      isOpen: true,
      title: "Are you sure you want to place this Order?",
      subTitle: "You can't revert this operation",
      action: "Save",
      confirmBtnStyle: {
        backgroundColor: "rgb(26, 188, 156)",
        color: "white",
      },
      onConfirm: async () => {
        let res3 = await OrderService.placeOrder(orderData);

        if (res3.status === 201) {
          console.log("---------8-----------");
          console.log("Order saved successfully!");
          // alert(res3.data.message);
          setOpenAlert({
            open: true,
            alert: res3.data.message,
            severity: "success",
            variant: "standard",
          });
          setConfirmDialog({ isOpen: false });
        } else {
          console.log("---------9-----------");
          // alert(res3.response.data.message);
          setConfirmDialog({ isOpen: false });
          setOpenAlert({
            open: true,
            alert: res3.response.data.message,
            severity: "error",
            variant: "standard",
          });
          return;
        }

        clearFields();
        // navigate("/cart");
        clearCart();
        clearTotals();
      },
    });
  };

  const calculateOrdeCost = () => {
    // finalsubtotal - coupon

    let cartTotal = finalSubtotal + shipping - receivedData.coupon - discount;
    console.log("cartTotal Rs: " + cartTotal);
    return cartTotal;
  };
  const clearFields = () => {
    setBillingInfoForm({
      billing_id: "",
      first_name: "",
      last_name: "",
      country: "",
      province: "",
      city: "",
      street_address: "",
      zip_code: "",
      phone_no: "",
      card_payment: true,
      cash_on_delivery: false,
      card_no: "",
      card_holder_name: "",
      card_expire_date: "",
      card_cvv: "",
      billing_status: "",
      coupon_price: "",
      user_id: "",
    });

    setIsDisabled(true);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const clearTotals = () => {
    setFinalSubTotal(0);
  };

  return (
    <div id="home">
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
          justifyContent="space-between"
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
              Checkout
            </Typography>
          </Grid>

          {/* ----------Billing & Payment Info--------------------- */}

          <Grid
            container
            rowGap={3}
            xl={5.8}
            lg={5.8}
            md={5.8}
            sm={12}
            xs={12}
            className={classes.details_container}
            display="flex"
            // justifyContent="center"
          >
            {/* ------------------ Billing Info ----------------------- */}

            <Grid
              container
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={classes.billing_info_container}
              display="flex"
              // justifyContent="center"
            >
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.biiling_info_title_container}
                display="flex"
              >
                <Typography variant="h5" className={classes.biiling_info_title}>
                  Billing Details
                </Typography>
              </Grid>
              {/* -------- Row 1 ------------- */}
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.billing_info_row}
                display="flex"
                justifyContent="space-between"
              >
                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.billing_info_row_left}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="f_name"
                    label="First Name"
                    placeholder="First Name"
                    value={billingInfoForm.first_name}
                    onChange={(e) => {
                      setBillingInfoForm({
                        ...billingInfoForm,
                        first_name: e.target.value,
                      });
                    }}
                    // onChange={(e) => setFirstName(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>

                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.billing_info_row_right}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="l_name"
                    label="Last Name"
                    placeholder="Last Name"
                    value={billingInfoForm.last_name}
                    onChange={(e) => {
                      setBillingInfoForm({
                        ...billingInfoForm,
                        last_name: e.target.value,
                      });
                    }}
                    // onChange={(e) => setFirstName(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>
              </Grid>

              {/* -------- Row 2 ------------- */}
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.billing_info_row}
                display="flex"
                justifyContent="space-between"
              >
                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.billing_info_row_left}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="country"
                    label="Country / Region"
                    placeholder="Country / Region"
                    value={billingInfoForm.country}
                    onChange={(e) => {
                      setBillingInfoForm({
                        ...billingInfoForm,
                        country: e.target.value,
                      });
                    }}
                    // onChange={(e) => setCountry(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>

                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.billing_info_row_right}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="province"
                    label="State / Province"
                    placeholder="State / Province"
                    value={billingInfoForm.province}
                    onChange={(e) => {
                      setBillingInfoForm({
                        ...billingInfoForm,
                        province: e.target.value,
                      });
                    }}
                    // onChange={(e) => setProvince(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>
              </Grid>

              {/* -------- Row 3 ------------- */}
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.billing_info_row}
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
                  className={classes.billing_info_row_left}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="address"
                    label="Street Address"
                    placeholder="Street Address"
                    value={billingInfoForm.street_address}
                    onChange={(e) => {
                      setBillingInfoForm({
                        ...billingInfoForm,
                        street_address: e.target.value,
                      });
                    }}
                    // onChange={(e) => setStreetAddress(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>
              </Grid>

              {/* -------- Row 4 ------------- */}
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.billing_info_row}
                display="flex"
                justifyContent="space-between"
              >
                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.billing_info_row_left}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="city"
                    label="Town / City"
                    placeholder="Town / City"
                    value={billingInfoForm.city}
                    onChange={(e) => {
                      setBillingInfoForm({
                        ...billingInfoForm,
                        city: e.target.value,
                      });
                    }}
                    // onChange={(e) => setCity(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>

                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.billing_info_row_right}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="postal"
                    label="Postal / ZIP Code"
                    placeholder="Postal / ZIP Code"
                    value={billingInfoForm.zip_code}
                    onChange={(e) => {
                      setBillingInfoForm({
                        ...billingInfoForm,
                        zip_code: e.target.value,
                      });
                    }}
                    // onChange={(e) => setPostalCode(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>
              </Grid>

              {/* -------- Row 5 ------------- */}
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.billing_info_row}
                display="flex"
                justifyContent="space-between"
              >
                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.billing_info_row_left}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="phone"
                    label="Phone"
                    placeholder="Phone"
                    value={billingInfoForm.phone_no}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      ); // Remove non-numeric characters
                      setBillingInfoForm({
                        ...billingInfoForm,
                        phone_no: numericValue,
                      });
                    }}
                    inputProps={{
                      pattern: "[0-9]*",
                    }}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>

                {/* <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.billing_info_row_right}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="email"
                    placeholder="Email"
                    value={billingInfoForm.email}
                    onChange={(e) => {
                      setBillingInfoForm({
                        ...billingInfoForm,
                        email: e.target.value,
                      });
                    }}
                    // onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid> */}
              </Grid>
            </Grid>

            {/* ----------- Payment Info ---------------------- */}

            <Grid
              container
              rowGap={2}
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={classes.payment_info_container}
              display="flex"
              // justifyContent="center"
            >
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.payment_info_title_container}
                display="flex"
              >
                <Typography variant="h5" className={classes.payment_info_title}>
                  Payment Details
                </Typography>
              </Grid>

              {/* -------------------- Radio buttons --------------------- */}

              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.payment_type_select_container}
                display="flex"
                justifyContent="space-between"
              >
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={paymentType}
                    // onChange={handlePaymentType}
                    onChange={(e) => {
                      let type = e.target.value;
                      if (type === "card") {
                        setBillingInfoForm({
                          ...billingInfoForm,
                          card_payment: true,
                          cash_on_delivery: false,
                        });
                        setIsVisible(true);
                      } else {
                        setBillingInfoForm({
                          ...billingInfoForm,
                          card_payment: false,
                          cash_on_delivery: true,
                        });
                        setIsVisible(false);
                      }
                      setPaymentType(type);
                    }}
                  >
                    <FormControlLabel
                      value="card"
                      control={
                        <Radio
                          sx={{
                            color: pink[800],
                            "&.Mui-checked": {
                              color: pink[600],
                            },
                          }}
                        />
                      }
                      label="Card"
                    />
                    <FormControlLabel
                      value="cash"
                      control={
                        <Radio
                          sx={{
                            color: pink[800],
                            "&.Mui-checked": {
                              color: pink[600],
                            },
                          }}
                        />
                      }
                      label="Cash On Delivery"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* --------------Payment Text Fields ------------- */}

              {isVisible ? (
                <Grid
                  container
                  rowGap={2}
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.payment_info_fields_container}
                  display="flex"
                  justifyContent="space-between"
                >
                  {/* -------- Row 1 ------------- */}
                  <Grid
                    container
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.payment_info_row}
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
                      className={classes.payment_info_row}
                    >
                      <MyTextField
                        variant="outlined"
                        type="text"
                        id="card_no"
                        label="Card Number"
                        placeholder="Card Number"
                        value={billingInfoForm.card_no}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          setBillingInfoForm({
                            ...billingInfoForm,
                            card_no: numericValue,
                          });
                        }}
                        inputProps={{
                          pattern: "[0-9]*",
                        }}
                        style={{ width: "100%", paddingTop: "5px" }}
                      />
                    </Grid>
                  </Grid>

                  {/* -------- Row 2 ------------- */}
                  <Grid
                    container
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.payment_info_row}
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
                      className={classes.payment_info_row}
                    >
                      <MyTextField
                        variant="outlined"
                        type="text"
                        id="card_holder"
                        label="Card Holder Name"
                        placeholder="Card Holder Name"
                        value={billingInfoForm.card_holder_name}
                        onChange={(e) => {
                          setBillingInfoForm({
                            ...billingInfoForm,
                            card_holder_name: e.target.value,
                          });
                        }}
                        // onChange={(e) => setCardHolderName(e.target.value)}
                        style={{ width: "100%", paddingTop: "5px" }}
                      />
                    </Grid>
                  </Grid>

                  {/* -------- Row 3 ------------- */}
                  <Grid
                    container
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.payment_info_row}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Grid
                      item
                      xl={5.8}
                      lg={5.8}
                      md={5.8}
                      sm={12}
                      xs={12}
                      className={classes.payment_info_row_left}
                    >
                      <MyTextField
                        variant="outlined"
                        type="text"
                        id="expireDate"
                        label="Expires MM/YY"
                        placeholder="Expires MM/YY"
                        value={billingInfoForm.card_expire_date}
                        onChange={(e) => {
                          setBillingInfoForm({
                            ...billingInfoForm,
                            card_expire_date: e.target.value,
                          });
                        }}
                        // onChange={(e) => setCardExpireDate(e.target.value)}
                        style={{ width: "100%", paddingTop: "5px" }}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={5.8}
                      lg={5.8}
                      md={5.8}
                      sm={12}
                      xs={12}
                      className={classes.payment_info_row_right}
                    >
                      <MyTextField
                        variant="outlined"
                        type="text"
                        id="cvv"
                        label="CVV"
                        placeholder="CVV"
                        value={billingInfoForm.card_cvv}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          setBillingInfoForm({
                            ...billingInfoForm,
                            card_cvv: numericValue,
                          });
                        }}
                        inputProps={{
                          pattern: "[0-9]*",
                        }}
                        style={{ width: "100%", paddingTop: "5px" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}

              {/* ----------------Save & Confirm Payment Info -------------- */}

              {/* <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.save_payment_info_container}
                display="flex"
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleCheckBox}
                        sx={{
                          color: pink[800],
                          "&.Mui-checked": {
                            color: pink[600],
                          },
                        }}
                      />
                    }
                    label="Save card details."
                  />
                </FormGroup>
              </Grid> */}

              {/* ---------- Save Card Detail button -------------- */}

              {/* <Grid
                item
                xl={6}
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className={classes.sbtn_save_card_info_container}
                display="flex"
              >
                <MyButton
                  label="Save Card Details"
                  size="small"
                  variant="outlined"
                  type="button"
                  className={classes.btn_save_card}
                  style={{ width: "100%", height: "90%" }}
                  onClick={(e) => {
                    console.log("Saved Card Details");
                  }}
                />
              </Grid> */}
            </Grid>
          </Grid>

          {/* -----------------Order Summary------------------ */}

          <Grid
            container
            xl={5.8}
            lg={5.8}
            md={5.8}
            sm={12}
            xs={12}
            className={classes.summary_container}
            display="flex"
          >
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={classes.summary_title_container}
              display="flex"
              //   justifyContent="center"
            >
              <Typography variant="h5" className={classes.order_summary_title}>
                Order Summary
              </Typography>
            </Grid>

            {/* ---------------------Summary Table ---------------- */}

            {/* -------- Table Headers------------- */}

            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={classes.tbl_summary_headers_container}
              display="flex"
              justifyContent="space-between"
            >
              <Typography variant="h6" className={classes.tbl_headers}>
                Product
              </Typography>

              <Typography variant="h6" className={classes.tbl_headers}>
                Subtotal
              </Typography>
            </Grid>

            {/*--------------------- Item Summary ------------------------ */}
            {cart.map((item, index) => {
              return <SummaryItem key={index} item={item} />;
            })}

            {/* ----------- Order Totals ----------- */}
            <CartTotals
              subtotal={finalSubtotal}
              coupon={finalSubtotal == 0 ? 0 : receivedData.coupon}
              shipping={0.0}
              discount={0.0}
            />

            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={classes.place_order_btn_container}
            >
              {/* <Link to="/cart/checkout"> */}
              <MyButton
                label="PLACE ORDER"
                size="large"
                variant="outlined"
                type="button"
                disabled={isDisabled}
                className={
                  isDisabled
                    ? classes.btn_place_order_disabled
                    : classes.btn_place_order
                }
                style={{ width: "100%", height: "90%" }}
                onClick={(e) => {
                  // console.log("Order Placed");
                  placeOrder();
                }}
              />
              {/* </Link> */}
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
export default withStyles(styleSheet)(Checkout);
