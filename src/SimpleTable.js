import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// Redux
import { connect } from "react-redux";
import { actions } from './store/actions'

const mapState = state => ({
  transactions: state.general.transactions,
});

const mapDispatch = dispatch => ({
});

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const etherscan = (
      <img
        style={{ height: "20px", width: "auto" }}
        alt="Etherscan"
        src="https://db5islsn2p9x4.cloudfront.net/etherscan.png"
      />
    );

function SimpleTable(props) {
  const { classes } = props;
  const data = props.transactions

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Transaction Hash</TableCell>
            <TableCell>Type of Transaction</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow key={n.hash}>
                <TableCell component="th" scope="row">
                  <a href={
                      "https://ropsten.etherscan.io/tx/" + n.hash
                    }
                    target="_blank"
                    style={{ marginLeft: "8px" }}
                  >
                  {etherscan} {n.hash}
                  </a>
                </TableCell>
                <TableCell>{n.type}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withStyles(styles)(SimpleTable));