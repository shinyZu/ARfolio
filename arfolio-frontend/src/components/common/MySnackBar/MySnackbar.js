import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";

function MySnackBar(props) {
  const [open, setOpen] = useState(false);

  // function handleClose() {}
  return (
    <>
      <Snackbar
        open={props.open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        severity={props.severity}
        onClose={() => {
          props.onClose();
        }}
      >
        <Alert
          onClose={() => {
            props.onClose();
          }}
          severity={props.severity}
          variant={props.variant}
          sx={{ width: "100%" }}
        >
          {props.alert}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MySnackBar;
