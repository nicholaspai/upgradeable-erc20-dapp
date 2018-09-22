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
import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";

// Web3
import { withWeb3 } from "react-web3-provider";
const contract = require("truffle-contract");

// Redux
import { connect } from "react-redux";

// Custom Components
import MetaMaskAlert from "./MetaMaskAlert";

// Carbon Dollar
const abi_CUSD = require("../../../contracts/CarbonDollar.json");
let CUSD = contract(abi_CUSD);

// CD Factory
const abi_CUSD_Factory = require("../../../contracts/CDFactory.json");
let CUSD_Factory = contract(abi_CUSD_Factory);

const styles = theme => ({
  root: {
    margin: theme.spacing.unit
  },
  margin: {
    margin: theme.spacing.unit
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

const mapState = state => ({
  verifiedPublicAddress: state.settings.publicAddress,
  nickname: state.settings.nickname,
  getCUSDBalance: state.web3.cusdBalance
});

const mapDispatch = dispatch => ({});

class SendCUSD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      recipientAddress: "",
      amount: 0,
      metaMaskAlertOpen: false,
      gasDefault: "25",
      open: false,
      transactionPending: false
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

  // Prompt metamask account owner to send ETH to user.
  send = () => {
    CUSD_Factory.setProvider(this.props.web3.currentProvider);
    CUSD.setProvider(this.props.web3.currentProvider);

    let gasPrice = this.props.web3.utils.toWei(this.state.gasDefault, "gwei");
    let conversion = 10 ** 18; // Same conversion as WEI to ETH

    return new Promise((resolve, reject) => {
      CUSD_Factory.deployed().then(cusdFactory => {
        cusdFactory.getToken(0).then(cusdAddress => {
          CUSD.at(cusdAddress).then(cusd => {
            this.setState({
              transactionPending: true
            });
            cusd
              .transfer(
                this.state.recipientAddress,
                this.state.amount * conversion,
                {
                  from: this.props.verifiedPublicAddress,
                  gasPrice
                }
              )
              .then(tx => {
                resolve(tx);
                this.setState({
                  transactionPending: false
                });
              })
              .catch(error => {
                reject(error.message);
                this.setState({
                  transactionPending: false
                });
              });
          });
        });
      });
    });
  };

  handleClose = () => {
    this.setState({
      metaMaskAlertOpen: false,
      loading: false,
      open: false
    });
  };

  handleSendCUSD = () => {
    this.setState({
      loading: true
    });
    this.send()
      .then(signature => {
        this.handleClose();
      })
      .catch(err => {
        this.handleClose();
      });
  };

  render() {
    const { classes } = this.props;
    const sendDisabled = Boolean(
      this.state.amount <= 0 ||
        this.state.amount > this.props.getCUSDBalance ||
        !this.state.recipientAddress
    );

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleOpen}
          className={classes.root}
        >
          <KeyboardArrowUp className={classes.leftIcon} />
          Send CUSD
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Send CUSD from " + this.props.nickname + "'s wallet"}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            <DialogContentText id="alert-dialog-description">
              Click 'Confirm' to send CUSD to your chosen address. The default
              gas amount is <b>{this.state.gasDefault}</b> Gwei, which you can
              change in the MetaMask prompt!
            </DialogContentText>
            <TextField
              className={classes.margin}
              onChange={this.handleChange}
              label="Address that you will send CUSD to"
              value={this.state.recipientAddress}
              name="recipientAddress"
              fullWidth
              type="text"
            />
            <TextField
              className={classes.margin}
              onChange={this.handleChange}
              label="Your current CUSD balance"
              value={this.props.getCUSDBalance}
              InputProps={{
                readOnly: true
              }}
              type="number"
              fullWidth
            />
            <TextField
              className={classes.margin}
              onChange={this.handleChange}
              name="amount"
              label="How much CUSD you will send"
              value={this.state.amount}
              helperText="Enter a positive number below your current balance"
              type="number"
              fullWidth
            />
            {this.state.transactionPending ? (
              <CircularProgress className={classes.progress} size={200} />
            ) : (
              ""
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              variant="outlined"
            >
              Close
            </Button>
            {this.state.loading ? (
              <Button disabled>Please sign the transaction in MetaMask!</Button>
            ) : (
              <Button
                onClick={this.handleSendCUSD}
                color="primary"
                variant="contained"
                disabled={sendDisabled}
              >
                Confirm
              </Button>
            )}
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

SendCUSD.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default connect(
  mapState,
  mapDispatch
)(withWeb3(withStyles(styles, { withTheme: true })(SendCUSD)));
