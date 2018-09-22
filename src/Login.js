import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Redux
import { connect } from 'react-redux'
import { actions } from './store/actions'

// Web3
import { withWeb3 } from 'react-web3-provider'

const mapState = state => ({
  loggedIn: state.general.verifiedAddress
});

const mapDispatch = dispatch => ({
  logUserIn: bool => dispatch(actions.setVerifiedAddress(bool)),
  setAddress: address => dispatch(actions.setAddress(address)),
})

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit * 2
  }
});

class Login extends React.Component {

 constructor(props) {
    super(props)
    this.state = {
      awaitingMetaMask: false,
      status: null,
    }
  }

  handleClickOpen = () => {
    this.setState({
      awaitingMetaMask: true
    })

    let web3 = this.props.web3
    if (!web3) {
      this.setState({ status: "No web 3 detected, exiting" })
      this.setState({ awaitingMetaMask: false })
      return
    } else {
      web3.eth.getCoinbase().then(address => {
        if(address) {
          this.handleVerifyAddress(address).then(() => {
            this.props.setAddress(address)
            this.setState({ awaitingMetaMask: false })
            this.props.logUserIn(true)
            return
          })
          .catch(error => {
            console.log(error.message)
            this.setState({ awaitingMetaMask: false })
            return
          })
        } else {
          this.setState({ awaitingMetaMask: false })
          this.setState({ status: "Log in to MetaMask if you have not already" })
          return
        }
      })

    }
  };

  // Popup MetaMask confirmation modal to sign message and "login"
  handleVerifyAddress = address => {
    return new Promise((resolve, reject) =>
      this.props.web3.eth.personal.sign(
        `By signing this message with my address, I am securely verifying that I own this ETH address!`,
        address,
        (err, signature) => {
          if (err) return reject(err);
          return resolve(signature);
        }
      )
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={!this.props.loggedIn}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Sign In"}</DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            <DialogContentText id="alert-dialog-description">
              Verify that you own your MetaMask address by signing a free message
            </DialogContentText>
            { this.state.awaitingMetaMask ? 
              (<Button
                variant="contained"
                size="large"
                disabled
                className={classes.button}
              >
                Awaiting MetaMask signature
              </Button>) : (
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={this.handleClickOpen}
                className={classes.button}
              >
                Verify address
              </Button>)
            }
            {this.state.status ? 
              (<Typography>{this.state.status}</Typography>) 
              : null
            }
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

Login.propTypes = {
   classes: PropTypes.object.isRequired,
}

export default withWeb3(connect(mapState, mapDispatch)(withStyles(styles)(Login)));