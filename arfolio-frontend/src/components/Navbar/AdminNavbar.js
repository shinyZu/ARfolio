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

import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ContactIcon from "@mui/icons-material/PermContactCalendar";
import StoreIcon from "@mui/icons-material/Store";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AdbIcon from "@mui/icons-material/Adb";

import profile_pic from "../../assets/images/Navbar/male_profile.jpg";
import logo from "../../assets/images/logo.png";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

// import LoginService from "../../services/LoginService";
import {jwtDecode} from "jwt-decode";

const footer_bg_texture =
  "https://www.transparenttextures.com/patterns/nistri.png";

const pages = ["Home", "Shop", "About Us", "Contact Us", "Cart"];
const settings = ["Profile", "Account", "Admin Panel", "Logout"];

const AdminNavbar = (props) => {
  const { classes } = props;
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [value, setValue] = useState("");

  // const [isLogged, setIsLoggedUser] = useState(true);
  const [isLogged, setIsLogged] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? true : false;
  });

  useEffect(() => {
    if (isLogged) {
      settings[3] = "Logout";
    } else {
      settings[3] = "Login";
    }
  });

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

  function changePage(e) {
    setValue(e.target.innerText);
  }

  const handleLogout = () => {
    let token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.username);
    logoutUser(decodedToken.username);
  };

  const logoutUser = async (username) => {
    let res = await LoginService.logout(username);
    console.log(res);

    if (res.status === 200) {
      if (res.data.data) {
        // remove tokn from LS
        localStorage.removeItem("token");
        // alert(res.data.message);

        console.log("------right before returning false from Navbar------");
        handleCloseUserMenu();
        setIsLogged(false);
        navigate("/home");
      }
    } else {
      alert(res.response.data.message);
    }
  };

  return (
    <AppBar
      position="static"
      style={{
        // backgroundImage: `url(${footer_bg_texture})`,
        width: "68%",
        margin: "auto",
      }}
    >
      <Container maxWidth="x3">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
          <Avatar
            alt="Remy Sharp"
            src={logo}
            large
            style={{ marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "ACme",
              fontWeight: 700,
              letterSpacing: ".3rem",
              // color: "inherit",
              color: "#AC7088",
              textDecoration: "none",
            }}
          >
            SchoolMart
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="a"
            // href="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Acme",
              fontWeight: 800,
              // letterSpacing: ".3rem",
              // color: "inherit",
              color: "#AC7088",
              textDecoration: "none",
            }}
          >
            Admin Panel
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="left">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
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
            ></Tabs>
          </Box>

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
                {settings.map((setting) =>
                  setting === "Admin Panel" ? (
                    <>
                      <MenuItem
                        key={setting}
                        onClick={() => {
                          navigate("/admin/panel");
                        }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    </>
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
                console.log("clciked login btn in admin navbar");
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
export default withStyles(styleSheet)(AdminNavbar);
