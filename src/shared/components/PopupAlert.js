import React, { Component } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const moment = require("moment");

class PopupAlert extends Component {
  onClose = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { shown, message, type } = this.props;
    console.log(shown, message, type);
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={shown || false}
        onClose={this.onClose}
        key={`topright_${moment().unix()}`}
        autoHideDuration={5000}
        style={{
          zIndex: 9999,
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={this.close}
          severity={type || "warning"}
        >
          {message || ""}
        </MuiAlert>
      </Snackbar>
    );
  }
}

export default PopupAlert;
