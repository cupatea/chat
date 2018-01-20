import React, { Component } from 'react'
import PropTypes from 'prop-types'
import User from './User'

class Sidebar extends Component {
  renderUsers(){
    return this.props.users.map(user =>
      <User
        key = { user.id }
        name = { user.name }
        id = { user.id }
        counter = { this.props.counters[user.id] }
      />
    )
  }

  render(){
    return(
      <div className = 'sidebar-container'>
        { this.renderUsers() }
      </div>
    )
  }
}

Sidebar.defaultProps = {
  users: [],
}

Sidebar.propTypes = {
  users: PropTypes.array,
}

export default Sidebar
