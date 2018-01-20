import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'

class MessagesList extends Component {
  componentDidMount(){
    this.scrollToBottom()
  }
  componentDidUpdate(){
    this.scrollToBottom()
  }
  pritifyTime(timestamp){
    const parsed = new Date(Date.parse(timestamp))
    const hours = parsed.getHours().toString()
    const minutes = parsed.getMinutes().toString()
    return(
      (hours.length < 2 ? `0${hours}` : hours)
      + ':' +
      (minutes.length < 2 ? `0${minutes}` : minutes)
    )
  }
  scrollToBottom(){
    this.messagesList.scrollIntoView({ block: "end" })
  }
  renderMessages(){
    return this.props.messages.map(message =>
      <Message
        key = { message.id }
        text = { message.body }
        time = { this.pritifyTime(message.created_at) }
        own  = { message.addresser_id == this.props.userId }
      />
    )
  }
  render(){
    return(
      <div
        className = 'messages-list'
        ref = { node => this.messagesList = node }
        children = { this.renderMessages() }
      />
    )
  }
}

MessagesList.defaultProps = {
  messages: [],
  userId: null,
}

MessagesList.propTypes = {
  messages: PropTypes.array,
  userId: PropTypes.string
}

export default MessagesList
