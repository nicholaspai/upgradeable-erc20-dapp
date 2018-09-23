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
import Autorenew from "@material-ui/icons/Autorenew";

// Redux
import { connect } from "react-redux";
import { actions } from '../store/actions'

// Custom Components
import MetaMaskAlert from "./MetaMaskAlert";
// Web3
import { withWeb3 } from "react-web3-provider";
const contract = require("truffle-contract");

// TokenProxy
const abi_proxy = require("../UpgradeableERC20/build/contracts/TokenProxy.json");
let TokenProxy = contract(abi_proxy);

// Token_V0
const abi_v0 = require("../UpgradeableERC20/build/contracts/Token_V0.json");
let Token_V0 = contract(abi_v0);

// Token_V1
const abi_v1 = require("../UpgradeableERC20/build/contracts/Token_V1.json");
let Token_V1 = contract(abi_v1);

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
  balance: state.general.balance,
  verifiedAddress: state.general.verifiedAddress,
});

const mapDispatch = dispatch => ({
  setBalance: balance => dispatch(actions.setBalance(balance)),
});

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      metaMaskAlertOpen: false,
    };
  }

  handleChange = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
    });

  handleRefreshBalance = () => {
    let web3 = this.props.web3;

    if (web3) {
      // Injected Web3 has been detected
      web3.eth.getCoinbase().then(address => {
        if (address === this.props.verifiedAddress) {
          // Fetched web3 list of active accounts
          this.getBalance().then(balance => {
            this.props.setBalance(balance)
            this.handleClose()
          })
          .catch(error => {
            console.log(error)
            this.handleClose()
          })
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

  getBalance = () => {
    TokenProxy.setProvider(this.props.web3.currentProvider);
    Token_V0.setProvider(this.props.web3.currentProvider);

    let conversion = 10 ** 18; // Same conversion as WEI to ETH

    return new Promise((resolve, reject) => {
      TokenProxy.deployed().then(proxy => {
          Token_V0.at(proxy.address).then(v0 => {
            this.setState({
              loading: true
            });
            v0
              .balanceOf(
                this.props.verifiedAddress,
              )
              .then(tx => {
                resolve(tx/conversion);
                this.setState({
                  loading: false
                });
              })
              .catch(error => {
                reject(error.message);
                this.setState({
                  loading: false
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

  render() {
    const { classes } = this.props;
    const sendDisabled = Boolean(
      this.state.amount <= 0 ||
        // this.state.amount > this.props.getCUSDBalance ||
        !this.state.recipientAddress
    );

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleRefreshBalance}
          className={classes.root}
        >
          <Autorenew className={classes.leftIcon} />
          Refresh
        </Button>
        <TextField
          className={classes.margin}
          onChange={this.handleChange}
          label="Your current balance"
          value={this.props.balance}
          InputProps={{
            readOnly: true
          }}
          type="number"
          fullWidth
        />
        <MetaMaskAlert
          open={this.state.metaMaskAlertOpen}
          handleClose={this.handleClose}
        />
        <Dialog
          open={this.state.loading}
          aria-labelledby="alert-dialog-description"
          style={{ textAlign: "center"}}
        >
          <DialogTitle id="alert-dialog-title">
            {"Loading data from Ethereum"}
          </DialogTitle>
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

Balance.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default connect(
  mapState,
  mapDispatch
)(withWeb3(withStyles(styles, { withTheme: true })(Balance)));
