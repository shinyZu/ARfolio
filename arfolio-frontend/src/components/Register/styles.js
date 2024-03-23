export const styleSheet = {
  login_container: {
    // border: "6px solid red",
    minWidth: "500px",
    margin: "0 auto",
    padding: "20px 20px",
    // border: "1px solid #ccc",
    borderRadius: " 4px",
    // marginRight: "170px",
  },

  login_text: {
    display: "flex",
    justifyContent:"center",
    // color: "#fff",
    color: "#164f70",
  },

  btn_register: {
    backgroundColor: "#164f70",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#143f58 !important",
    },
  },

  btn_register_disabled: {
    backgroundColor: "#7f8c8d !important",
    "&:hover": {
      cursor: "default",
      backgroundColor: "#7f8c8d !important",
    },
  },

  register_footer: {
    // border: "6px solid red",
    display: "flex",
    flexDirection: "column",
  },

  register_footer_text: {
    color: "#164f70",
    textAlign: "center",
    paddingTop: "10px",
  },

  txt_login: {
    color:"#B53471",
    paddingLeft:"3px",
    "&:hover": {
      cursor: "pointer",
    },
  },
};
