import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'stylesheets/chat/MessagesList.css'
import Message from './Message'


class MessagesList extends Component {
  static pritifyTime(timestamp) {
    const parsed = new Date(Date.parse(timestamp))
    const hours = parsed.getHours().toString()
    const minutes = parsed.getMinutes().toString()
    return (
      `${hours.length < 2 ? `0${hours}` : hours}:${minutes.length < 2 ? `0${minutes}` : minutes}`
    )
  }
  renderMessages() {
    return this.props.messages.map(message => (
      <Message
        key = { message.id }
        text = { message.body }
        time = { MessagesList.pritifyTime(message.created_at) }
        own = { message.addresser_id === this.props.userId }
      />
    ))
  }
  render() {
    return (
      <div
        className = 'messages-list'
        ref = { (node) => { this.messagesList = node } }
      >
        { this.renderMessages() }
      </div>
    )
  }
}

MessagesList.defaultProps = {
  messages: [],
  userId: null,
}

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    body: PropTypes.string,
    addresser_id: PropTypes.number,
    addressee_id: PropTypes.number,
  })),
  userId: PropTypes.number,
}

export default MessagesList
