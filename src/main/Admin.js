import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// MUI Components
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

// MUI Icons

// Custom Components
import SimpleLineChart from '../SimpleLineChart';
import SimpleTable from '../SimpleTable';
import Mint from '../web3/Mint'

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
});

class Admin extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div>
          <div className={classes.appBarSpacer} />
                <Typography variant="display1" gutterBottom>
                  You must be the contract owner to use these controls
                </Typography>
                <Mint />
        </div>
      </React.Fragment>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withStyles(styles)(Admin));