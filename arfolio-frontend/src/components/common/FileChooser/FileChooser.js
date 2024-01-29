import React, { useState } from "react";
import { withStyles } from "@mui/styles";
import { styleSheet } from "./styles.js";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Box } from "@mui/material";

function FileChooser(props) {
  const { classes } = props;

  return (
    <div className={classes.upload__section}>
      <Button
        component="label"
        variant="outlined"
        // startIcon={<UploadFileIcon />}
        startIcon={
          props.page === "profile" ? <AddAPhotoIcon /> : <UploadFileIcon />
        }
        // sx={{ marginRight: "1rem" }}
        // className={classes.upload__btn}
        style={props.style}
        className={
          props.page === "profile"
            ? classes.upload__btn_without_style
            : classes.upload__btn
        }
        // style={
        //   props.page === "profile"
        //     ? {
        //         position: "absolute",
        //         top: "0",
        //         left: "0",
        //         right: "0",
        //         bottom: "0",
        //         margin: "auto",
        //       }
        //     : props.style
        // }
        // onMouseEnter={props.onMouseEnter()}
        // onMouseLeave={props.onMouseLeave()}
      >
        {props.text}
        <input
          type="file"
          accept="*"
          hidden
          //   multiple={props.page != "profile" && props.multiple}
          onChange={(e) => {
            props.onUpload(e);
          }}
        />
      </Button>
      {!props.displayFileName ? null : (
        <Box
          style={{ display: props.displayFileName }}
          className={classes.uploaded__file}
        >
          {props.file}
        </Box>
      )}
    </div>
  );
}

export default withStyles(styleSheet)(FileChooser);
