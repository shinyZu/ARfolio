import login_form_background from "../../assets/images/Login/bg_login_form_1.png";

export const styleSheet = {
  login_container: {
    // border: "6px solid red",
    minWidth: "600px",
    margin: "0 auto",
    padding: "20px 20px",
    borderRadius: " 4px",
    // border: "1px solid #ccc",
    // marginRight: "200px",
  },

  login_text: {
    display: "flex",
    justifyContent:"center",
    // color: "#fff",
    color: "#164f70",
  },

  btn_login: {
    // backgroundColor: "#2c3e50",
    backgroundColor: "#164f70",
    fontWeight:"bold",
    boxShadow: "5px 5px 10px 2px rgb(7 12 8 / 50%) !important",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#143f58 !important",
    },
  },

  btn_login_disabled: {
    backgroundColor: "#7f8c8d !important",
    "&:hover": {
      cursor: "default",
      backgroundColor: "#7f8c8d !important",
    },
  },

  login_footer: {
    // border: "6px solid red",
    display: "flex",
    flexDirection: "column",
  },

  login_footer_text: {
    // color:"#fff",
    color: "#164f70",
    textAlign: "center",
    paddingTop: "10px",
  },

  txt_register: {
    color:"#B53471",
    paddingLeft:"3px",
    "&:hover": {
      cursor: "pointer",
    },
  },
};
