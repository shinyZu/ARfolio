import React, { useState, useEffect } from "react";
import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Header from "../../components/Header/Header";
import MyButton from "../../components/common/MyButton/MyButton";

const Process = (props) => {
  const { classes} = props;

  return (
    <div >
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
            justifyContent="center"
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
                    Your AR-enabled Portfolio Card has been generated successfully..!
                </Typography>
            </Grid>

            <Grid
                item
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                display="flex"
                justifyContent="center"
                style={{marginTop:"4vh"}}
            >
                <div className={classes.qr_container}> </div>
            </Grid>
            
            <Grid
                item
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                display="flex"
                justifyContent="center"
                style={{marginTop:"4vh"}}
            >
               <MyButton
                    label="Download QR Code"
                    size="small"
                    variant="outlined"
                    type="button"
                    style={{ width: "20%", height: "100%" }}
                    className={classes.btn_download}
                    // onClick={() => {}}
                />
            </Grid>

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
                <Typography variant="h6" className={classes.txt_qr_description}>
                    Use this QR code to launch the AR application.<br></br>
                    You can also use this same QR code to experience your the AR-enabled Portfolio. 
                </Typography>
            </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default withStyles(styleSheet)(Process);
