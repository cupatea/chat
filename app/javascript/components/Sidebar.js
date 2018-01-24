import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import User from './User'
import Filter from './Filter'

TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterString: '',
    }
  }
  renderUsers() {
    return this.props.users
      .filter(user =>
        user.name && user.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
      .sort((a, b) => {
        const counter = this.props.sentCounter
        if (!counter[a.id]) { return 1 }
        if (!counter[b.id]) { return -1 }
        return counter[b.id] - counter[a.id]
      })
      .map(user => (
        <User
          current = { user.id === this.props.currentUserId }
          key = { user.id }
          name = { user.name }
          id = { user.id }
          online = { user.online }
          lastSeen = { timeAgo.format(Date.parse(user.last_seen_at)) }
          sentCount = { this.props.sentCounter[user.id] }
          newCount = { this.props.newCounter[user.id] }
          clicked = { this.props.setRoomHandler }
        />
      ))
  }
  render() {
    return (
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
  setRoomHandler: () => {},
}

Sidebar.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  })),
  currentUserId: PropTypes.number,
  sentCounter: PropTypes.shape({
    [PropTypes.number]: PropTypes.number,
  }),
  newCounter: PropTypes.shape({
    [PropTypes.number]: PropTypes.number,
  }),
  setRoomHandler: PropTypes.func,
}

export default Sidebar
