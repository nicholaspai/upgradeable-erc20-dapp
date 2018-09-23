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
  section: {
    marginTop: theme.spacing.unit*2,
  }
});

class Admin extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div>
          <div className={classes.appBarSpacer} />
                <Typography variant="display1" gutterBottom className={classes.section}>
                  You must be the contract owner to use these controls
                </Typography>
                <Mint className={classes.section}/>
                <Divider variant='inset' />
                <Typography variant="display1" gutterBottom className={classes.section}>
                   Transaction History
                 </Typography>
                 <div className={classes.tableContainer}>
                   <SimpleTable />
                 </div>
        </div>
      </React.Fragment>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withStyles(styles)(Admin));