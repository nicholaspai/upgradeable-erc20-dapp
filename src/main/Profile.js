import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// MUI Components
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

// MUI Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import EvStation from '@material-ui/icons/EvStation'

// Custom Components
import MetaMaskAlert from '../web3/MetaMaskAlert'

// Redux
import { connect } from 'react-redux'
import { actions } from '../store/actions'

// Web3
import { withWeb3 } from 'react-web3-provider'

const mapState = state => ({
  verifiedAddress: state.general.verifiedAddress,
  gasPrice: state.general.gas,
});

const mapDispatch = dispatch => ({
  setVerifiedAddress: address => dispatch(actions.setVerifiedAddress(address)),
  setGasPrice: gas => dispatch(actions.setGas(gas))
})

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  button: {
    // margin: theme.spacing.unit * 2
  },
  textField: {
    margin: theme.spacing.unit * 2,
    width: 400
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

class Profile extends React.Component {
  state = {
    expanded: null,
    awaitingMetaMask: false,
    metamaskAlertOpen: false,
    newGasCost: 0,
  };

  handleCloseAlert = () => {
    this.setState({ metamaskAlertOpen: false})
  }

  handleChangePanel = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
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

  handleClickOpen = () => {
    this.setState({
      awaitingMetaMask: true
    })

    let web3 = this.props.web3
    if (!web3) {
      this.setState({ metamaskAlertOpen: true })
      this.setState({ awaitingMetaMask: false })
      return
    } else {
      web3.eth.getCoinbase().then(address => {
        if(address) {
          this.handleVerifyAddress(address).then(() => {
            this.props.setVerifiedAddress(address)
            this.setState({ awaitingMetaMask: false })
            return
          })
          .catch(error => {
            console.log(error.message)
            this.setState({ awaitingMetaMask: false })
            return
          })
        } else {
          this.setState({ awaitingMetaMask: false })
          this.setState({ metamaskAlertOpen: true })
          return
        }
      })

    }
  };

  handleChange = name => event => {
  this.setState({
      [name]: event.target.value,
    })
  }

  submitGas = () => {
    if(this.state.newGasCost > 0) {
      this.props.setGasPrice(this.state.newGasCost)
      return;
    } else {
      console.log('Please enter a gas cost greater than 0')
      return;
    }
  }

  render() {
    const { classes } = this.props;
    const { expanded, awaitingMetaMask, newGasCost } = this.state
    return (
      <React.Fragment>
        <CssBaseline />
          <div className={classes.appBarSpacer} />
                <Typography variant="display1" gutterBottom>
                  Profile
                </Typography>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChangePanel('panel1')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Login</Typography>
                    <Typography className={classes.secondaryHeading}>
                    {Boolean(this.props.verifiedAddress) ? 
                      ("You are signed in as: " + this.props.verifiedAddress) :
                      ("Sign in via MetaMask")
                    }
                    
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                      { awaitingMetaMask ? 
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
                          color="primary"
                          onClick={this.handleClickOpen}
                          className={classes.button}
                        >
                          <SupervisorAccount className={classes.leftIcon} />
                          Verify address
                        </Button>)
                      }
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChangePanel('panel2')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Set Default Gas Price</Typography>
                    <Typography className={classes.secondaryHeading}>
                      The default gas price used for sending transactions is:  {this.props.gasPrice} Gwei
                      For more information on gas costs go <a href='https://ethgasstation.info/' target='_blank'>here</a>
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <TextField 
                      label="Gas cost in Gwei" 
                      className={classes.textField}
                      type="number"
                      value={newGasCost}
                      onChange={this.handleChange('newGasCost')}
                      margin="normal"
                      helperText="Enter a positive number"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.submitGas}
                    >
                    <EvStation className={classes.leftIcon} />
                    Update Gas cost
                    </Button>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <MetaMaskAlert open={this.state.metamaskAlertOpen} handleClose={this.handleCloseAlert} />
      </React.Fragment>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withWeb3(withStyles(styles)(Profile)));