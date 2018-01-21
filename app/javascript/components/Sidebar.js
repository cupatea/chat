import React, { Component } from 'react'
import PropTypes from 'prop-types'
import User from './User'
import Filter from './Filter'

class Sidebar extends Component {
  constructor(props){
    super(props)
    this.state = {
      filterString: '',
    }
  }
  renderUsers(){
    return this.props.users
    .filter(user =>
      user.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
    .map(user =>
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
        <Filter
          placeholder = 'Search'
          onTextChange = { text => this.setState({ filterString: text }) }
        />
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
