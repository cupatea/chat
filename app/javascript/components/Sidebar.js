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
        user.name && user.name.toLowerCase().includes(this.state.filterString.toLowerCase())
      )
      .sort((a, b) => {
        const counter = this.props.sentCounter
        return !counter[a.id] ? 1 : (!counter[b.id] ? -1 : counter[b.id] - counter[a.id])
      })
      .map(user =>
        <User
          current = { user.id == this.props.currentUserId }
          key = { user.id }
          name = { user.name }
          id = { user.id }
          sentCount = { this.props.sentCounter[user.id] }
          newCount = { this.props.newCounter[user.id] }
          clicked = { this.props.setRoomHandler }
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
  currentUserId: null,
  sentCounter: {},
  newCounter: {},
  roomSetHandler: () => {},
}

Sidebar.propTypes = {
  users: PropTypes.array,
  currentUserId: PropTypes.number,
  sentCounter: PropTypes.object,
  newCounter: PropTypes.object,
  setRoomHandler: PropTypes.func,
}

export default Sidebar
