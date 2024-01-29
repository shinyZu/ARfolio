export const styleSheet = {
  nav__bar: {
    // border: "2px solid red",
    // backgroundColor: "#205a76",
    // backgroundColor: "#0c5199",
    // backgroundColor: "#192a56",
    padding: "10px 0px",
    // boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
    boxShadow: "9px 6px 14px 4px rgb(7 12 8 / 49%) !important",
    display: "flex",
    flexDirection: "row",
    color: "white",
    position: "sticky",
    top: "0",
    width: "100%",
    transitionProperty: "top",
    transitionDuration: "2s",
    zIndex: "3",
    background: "linear-gradient(280deg,#205a76,#2980b9)",
    backgroundImage: `url("https://www.transparenttextures.com/patterns/vintage-speckles.png")`,
  },
  nav__tabs: {
    // border: "2px solid deeppink",
    width: "100%",
  },
  nav_left: {
    // border: "2px solid blue",
    alignItems: "flex-start",
  },
  nav__right: {
    // border: "2px solid green",
    display: "flex",
    marginLeft: "20px",
    justifyContent: "flex-end",
    width: "95%",
  },

  nav__text: {
    // border: "2px solid green",
    color: "black",
    fontWeight: "700 !important",
    fontFamily: '"Acme", sans-serif !important',
    fontSize: "0.975rem !important",
    textDecoration: "none",
    // "&:focus": {
    //   color: "yellow",
    // },
  },

  nav_btn_login: {
    border: "1px #273c75 !important",
    backgroundColor: "#273c75 !important",
    color: "white !important",
    fontFamily: '"Acme", sans-serif !important',
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#192a56 !important",
    },
    // padding: "5px 15px!important",
    boxShadow: "5px 5px 10px 2px rgb(7 12 8 / 50%) !important",
  },
};
