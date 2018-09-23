import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// MUI Components
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider'

// MUI Icons

// Custom Components
import SimpleTable from '../SimpleTable';
import SendERC20 from '../web3/SendERC20';
import Balance from '../web3/Balance'
import Burn from '../web3/Burn'

// Redux
import { connect } from 'react-redux'
import { actions } from '../store/actions'

const mapState = state => ({
  verifiedAddress: state.general.verifiedAddress
});

const mapDispatch = dispatch => ({
})

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  section: {
    marginTop: theme.spacing.unit*2,
  }
});

class Home extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div>
          <div className={classes.appBarSpacer} />
                <Typography variant="display1" gutterBottom className={classes.section}>
                  Transfer and burn UpgradeableERC20
                </Typography>
                <Balance className={classes.section}/>
                <Divider variant="inset" />
                <SendERC20 className={classes.section}/>
                <Divider variant="inset" />
                <Burn className={classes.section}/>
                <Divider variant="inset" />
                <Typography variant="display1" gutterBottom className={classes.section}>
                 Transactions
                </Typography>
                <div className={classes.tableContainer}>
                 <SimpleTable />
                </div> 
        </div>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withStyles(styles)(Home));