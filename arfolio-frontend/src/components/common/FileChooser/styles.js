export const styleSheet = {
  upload__section: {
    // border: "2px solid green",
    display: "flex",
    // flexDirection: "column",
  },

  upload__btn: {
    border: "1px solid #DEB6AB !important",
    width: "34vw",
    height: "40px",
    backgroundColor: "#DEB6AB !important",
    color: "white !important",
    fontFamily: '"Acme", sans-serif !important',
    // margin: "5px 0px !important",
    // border: "none !important",
    "&:hover": {
      backgroundColor: "#DBA39A !important",
    },
  },

  upload__btn_without_style: {
    border: "none !important",
    marginTop: "-115px !important",
    marginRight: "242px !important",
    marginLeft: "425px !important",
    color: "black !important",
    zIndex: "4",
    // fontSize: "90px !important",

    "&:hover": {
      backgroundColor: "none !important",
    },
  },

  uploaded__file: {
    // border: "2px solid blue !important",
    width: "100%",
    height: "30px",
    marginTop: "10px",
    marginLeft: "15px",
  },
};
