import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  media: {
    height: 0,
    width: "100%",
    paddingTop: "56.25%" // 16:9
  },
  card: {
    margin: theme.spacing.unit * 2
  }
});

class MetaMaskAlert extends Component {
  render() {
    // const { classes } = this.props;

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Please install and login to MetaMask before continuing."}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This dApp uses MetaMask to securely authenticate your Ethereum public
              address.{" "}
              <b>Please log in using the same address that you verified. </b>
              If you have not verified an address, then you can do so in
              Profile!{" "}
              <i>
                If you are installing Metamask for the first time please refresh
                the page.
              </i>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.props.handleClose}
              color="primary"
              variant="contained"
            >
              Close
            </Button>
            <Button
              target="_blank"
              href="https://metamask.io/"
              color="secondary"
              variant="outlined"
            >
              Install MetaMask
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

MetaMaskAlert.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default withStyles(styles)(MetaMaskAlert);
