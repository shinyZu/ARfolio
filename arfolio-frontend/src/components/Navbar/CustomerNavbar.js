import { React, useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link, NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";

import AdbIcon from "@mui/icons-material/Adb";

import profile_pic from "../../assets/images/Navbar/male_profile.jpg";
import logo from "../../assets/images/Navbar/logo.png";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

// import LoginService from "../../services/LoginService";
import {jwtDecode} from "jwt-decode";

const footer_bg_texture =
  "https://www.transparenttextures.com/patterns/nistri.png";

const pages = ["Home", "Shop", "About Us", "Contact Us", "Cart"];

const CustomerNavbar = (props) => {
  const { classes } = props;
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [value, setValue] = useState("0");

  const [settings, setSettings] = useState([
    "Profile",
    "Account",
    "Order History",
    "Logout",
  ]);

  // const [isLogged, setIsLoggedUser] = useState(false);
  const [isLogged, setIsLogged] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? true : false;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isAdmin = jwtDecode(token).user_role === "Admin";
      return isAdmin ? true : false;
    }
  });

  const [isCustomer, setIsCustomer] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isCustomer = jwtDecode(token).user_role === "Customer";
      return isCustomer ? true : false;
    }
  });

  useEffect(() => {
    console.log("-------in Customer Navbar------");
    console.log("isAdmin : " + isAdmin);
    console.log("isCustomer: " + isCustomer);
    console.log("settings 1: " + settings);

    // if (isLogged) {
    //   settings[3] = "Logout";
    // } else {
    //   settings[3] = "Login";
    // }

    const token = localStorage.getItem("token");
    if (token) {
      if (token.user_role === "Admin") {
        setIsAdmin(true);
      } else {
        setIsCustomer(true);
      }
    }

    console.log("settings 2: " + settings);
  });

  useEffect(() => {
    if (isLogged) {
      setSettings((prevSettings) => {
        const updatedSettings = [...prevSettings]; // Create a copy of the original array
        updatedSettings[3] = "Logout"; // Update the second index with the new value
        return updatedSettings; // Return the updated array
      });
    } else {
      setSettings((prevSettings) => {
        const updatedSettings = [...prevSettings];
        updatedSettings[3] = "Login";
        return updatedSettings;
      });
    }

    const token = localStorage.getItem("token");
    if (token) {
      if (jwtDecode(token).user_role === "Admin") {
        console.log("--------update with Admin Panel-------------");
        // setIsAdmin(true);
        setSettings((prevSettings) => {
          const updatedSettings = [...prevSettings];
          updatedSettings[2] = "Admin Panel";
          return updatedSettings;
        });
      } else {
        // setIsCustomer(true);
        console.log("--------update with Order History-------------");
        setSettings((prevSettings) => {
          const updatedSettings = [...prevSettings];
          updatedSettings[2] = "Order History";
          return updatedSettings;
        });
      }
    }
    console.log("settings 3: " + settings);
  }, []);

  const navLinkStyle = ({ isActive }) => {
    return {
      color: isActive ? "#D25380" : "normal",
    };
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const goToOrderHistory = () => {
    navigate("/order/history");
  };

  const changePage = (e, v) => {
    console.log(v);
    // setValue(e.target.innerText);
    setValue(v);
  };

  const handleLogout = () => {
    let token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.username);
    logoutUser(decodedToken.username);
  };

  const logoutUser = async (username) => {
    // let res = await LoginService.logout(username);
    // console.log(res);

    // if (res.status === 200) {
    //   if (res.data.data) {
    //     // remove tokn from LS
    //     localStorage.removeItem("token");
    //     // alert(res.data.message);

    //     console.log("------right before returning false from Navbar------");
    //     handleCloseUserMenu();
    //     setIsLogged(false);
    //     navigate("/home");
    //   }
    // } else {
    //   alert(res.response.data.message);
    // }
  };

  return (
    <AppBar
      position="static"
      style={{
        backgroundImage: `url(${footer_bg_texture})`,
        width: "68%",
        margin: "auto",
        backgroundColor:"#fff"
      }}
    >
      <Container maxWidth="x3">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
          <Avatar
            alt="Remy Sharp"
            src={logo}
            large
            style={{ marginRight: "10px", width:"5vw", height:"5vw"}}
            onClick={()=>{navigate("/home")}}
            className={classes.logo_container}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Acme",
              fontWeight: 800,
              letterSpacing: ".3rem",
              // color: "inherit",
              color: "#6576bf",
              textDecoration: "none",
            }}
          >
            ARfolio
          </Typography>

          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
            
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Tabs
              value={value}
              onChange={changePage}
              className={classes.nav__tabs}
              // textColor="secondary"
              // indicatorColor="secondary"
              // aria-label="secondary tabs example"
            >
              {/* {isLogged ? (
                <NavLink
                  smooth
                  to="/cart"
                  className={classes.nav__text}
                  style={navLinkStyle}
                >
                  <Tab
                    value="5"
                    icon={<ShoppingCartIcon />}
                    className={classes.nav__text}
                    label="Cart"
                  />
                </NavLink>
              ) : null} */}
            </Tabs>
          </Box>
          {/* <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box> */}
          {isLogged ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={profile_pic} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* If a Customer is logged in */}

                {settings.map((setting) =>
                  isCustomer && setting === "Order History" ? (
                    <MenuItem key={setting} onClick={goToOrderHistory}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ) : isAdmin && setting === "Admin Panel" ? (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        navigate("/admin/panel");
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ) : setting === "Logout" ? (
                    <MenuItem key={setting} onClick={handleLogout}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>
          ) : (
            <Button
              className={classes.nav_btn_login}
              onClick={() => {
                console.log("clciked login btn in navbar");
                navigate("/login");
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
// export default Navbar;
export default withStyles(styleSheet)(CustomerNavbar);
