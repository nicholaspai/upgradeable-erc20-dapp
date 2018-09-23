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
import Polymer from "@material-ui/icons/Polymer";
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
  verifiedAddress: state.general.verifiedAddress,
  gasPrice: state.general.gas,
  balance: state.general.balance,
  transactions: state.general.transactions,
});

const mapDispatch = dispatch => ({
  setBalance: balance => dispatch(actions.setBalance(balance)),
  addTransaction: transaction => dispatch(actions.addTransaction(transaction))
});

class Burn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      recipientAddress: "",
      amount: 0,
      metaMaskAlertOpen: false,
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
        if (address === this.props.verifiedAddress) {
          // Fetched web3 list of active accounts
          this.getBalance().then(balance => {
            this.props.setBalance(balance)
            this.setState({
              open: true
            });
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

  // Prompt metamask account owner to burn ETH from user.
  burn = () => {
    TokenProxy.setProvider(this.props.web3.currentProvider);
    Token_V0.setProvider(this.props.web3.currentProvider);

    let gasPrice = this.props.web3.utils.toWei(this.props.gasPrice.toString(), "gwei");
    let conversion = 10 ** 18; // Same conversion as WEI to ETH

    return new Promise((resolve, reject) => {
      TokenProxy.deployed().then(proxy => {
          Token_V0.at(proxy.address).then(v0 => {
            this.setState({
              transactionPending: true
            });
            v0
              .burn(
                this.state.amount * conversion,
                {
                  from: this.props.verifiedAddress,
                  gasPrice
                }
              )
              .then(tx => {
                resolve(tx);
                this.props.addTransaction({ 'hash': tx.tx, 'type': 'burn'})
                this.setState({
                  transactionPending: false
                });
              })
              .catch(error => {
                reject(error.message);
                this.setState({
                  transactionPending: false,
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

  handleBurnERC20 = () => {
    this.setState({
      loading: true
    });
    this.burn()
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
        this.state.amount > this.props.balance 
    );

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleOpen}
          className={classes.root}
        >
          <Polymer className={classes.leftIcon} />
          Burn Tokens
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Burn UpgradeableERC20"}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            <DialogContentText id="alert-dialog-description">
              Click 'Confirm' to burn UpgradeableERC20 from your verified address. The default
              gas amount is currently set to <b>{this.props.gasPrice}</b> Gwei, which you can
              change in the MetaMask prompt!
            </DialogContentText>
            <TextField
              className={classes.margin}
              variant="filled"
              onChange={this.handleChange}
              label="Your current balance"
              value={this.props.balance}
              InputProps={{
                readOnly: true
              }}
              type="number"
              fullWidth
            />
            <TextField
              required
              className={classes.margin}
              onChange={this.handleChange}
              name="amount"
              label="How much you will burn"
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
                onClick={this.handleBurnERC20}
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

Burn.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default connect(
  mapState,
  mapDispatch
)(withWeb3(withStyles(styles, { withTheme: true })(Burn)));
