import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

// Icons
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";

// Web3
import { withWeb3 } from "react-web3-provider";

// Redux
import { connect } from "react-redux";

// Custom Components
import MetaMaskAlert from "./MetaMaskAlert";

const styles = theme => ({
  root: {
    margin: theme.spacing.unit
  },
  margin: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

const mapState = state => ({
  verifiedPublicAddress: state.settings.publicAddress,
  nickname: state.settings.nickname
});

const mapDispatch = dispatch => ({});

class ReceiveCUSD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metaMaskAlertOpen: false,
      open: false
    };
  }

  handleChange = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
    });

  handleOpen = () => {
    let web3 = this.props.web3;

    if (web3) {
      // Injected Web3 has been detected
      web3.eth.getCoinbase().then(address => {
        if (address === this.props.verifiedPublicAddress) {
          // Fetched web3 list of active accounts
          this.setState({
            open: true
          });
        } else {
          this.setState({
            metaMaskAlertOpen: true
          });
        }
      });
    } else {
      this.setState({
        metaMaskAlertOpen: true
      });
      return;
    }
  };

  handleClose = () => {
    this.setState({
      metaMaskAlertOpen: false,
      open: false
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleOpen}
          className={classes.root}
        >
          <KeyboardArrowDown className={classes.leftIcon} />
          Receive CUSD
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Receive CUSD in " + this.props.nickname + "'s wallet"}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            <DialogContentText id="alert-dialog-description">
              You can receive CUSD at this address! You can also change this
              address in Settings
            </DialogContentText>
            <TextField
              className={classes.margin}
              label="Your verified ETH address"
              value={this.props.verifiedPublicAddress}
              InputProps={{
                readOnly: true
              }}
              fullWidth
              type="text"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              variant="outlined"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <MetaMaskAlert
          open={this.state.metaMaskAlertOpen}
          handleClose={this.handleClose}
        />
      </React.Fragment>
    );
  }
}

ReceiveCUSD.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default connect(
  mapState,
  mapDispatch
)(withWeb3(withStyles(styles, { withTheme: true })(ReceiveCUSD)));
