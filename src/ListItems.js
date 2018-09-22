import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';

// Redux
import { connect } from 'react-redux'
import { actions, resetMain } from './store/actions'

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  setHome: bool => dispatch(actions.setHome(bool)),
  setLogin: bool => dispatch(actions.setLogin(bool)),
  setAdmin: bool => dispatch(actions.setAdmin(bool)),
  resetMain: () => dispatch(resetMain())
})

class ListItems extends Component {

  // Set Main component
  // ** Must first call resetMain() to reset main component **
  handleSetHome = () => {
    this.props.resetMain()
    this.props.setHome(true)
  }
  handleSetProfile = () => {
    this.props.resetMain()
    this.props.setLogin(true)
  }
  handleSetAdmin = () => {
    this.props.resetMain()
    this.props.setAdmin(true)
  }


  render () {
    return (
    <div>
      <ListItem button onClick={this.handleSetHome}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button onClick={this.handleSetProfile}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button onClick={this.handleSetAdmin}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Admin" />
      </ListItem>
    </div>
    )
  }
}

export default connect(mapState, mapDispatch)(ListItems)

// export const mainListItems = (
//   <div>
//     <ListItem button>
//       <ListItemIcon>
//         <DashboardIcon />
//       </ListItemIcon>
//       <ListItemText primary="Dashboard" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <PeopleIcon />
//       </ListItemIcon>
//       <ListItemText primary="Profile" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <BarChartIcon />
//       </ListItemIcon>
//       <ListItemText primary="Admin" />
//     </ListItem>
//   </div>
// );

