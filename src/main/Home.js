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

class Home extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div>
          <div className={classes.appBarSpacer} />
                <Typography variant="display1" gutterBottom>
                  Transactions History
                </Typography>
                <Typography component="div" className={classes.chartContainer}>
                  <SimpleLineChart />
                </Typography>
                <Typography variant="display1" gutterBottom>
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