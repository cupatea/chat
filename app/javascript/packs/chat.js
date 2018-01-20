import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import Message from '../components/Message'

axios.defaults.headers.common = {
  'X-CSRF-TOKEN' : document.getElementsByName('csrf-token')[0].content
}

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      adresserId: null,
      messagesList: [],
      messageText: '',
    }
  }
  componentDidMount() {
    this.fetchMessages()
    this.createMessagesSubscription()
    this.scrollToBottom()
  }
  componentDidUpdate(){
    this.scrollToBottom()
  }
  createMessagesSubscription(){
    App.messages = App.cable.subscriptions.create('MessagesChannel', {
      received: data => this.setState({
        messagesList: [...this.state.messagesList, data]
      })
    })
  }
  fetchMessages() {
    axios.get(`${this.props.roomId}/messages`)
    .then(response => this.setState({
      messagesList: response.data
    }))
    .catch(error => console.log(error))
  }
  handleChange(event){
    this.setState({ messageText: event.target.value })
  }
  handleEnterKeyPress(event){
    if(event.keyCode === 13) {
      event.preventDefault()
      this.handleSubmit()
    }
  }
  handleSubmit(){
    if(this.state.messageText){
      axios.post(`/messages`,{
        message:{
          body: this.state.messageText,
          addressee_id: this.props.roomId,
        }
      })
      .then(response =>
        this.setState({ messageText: '' })
      )
      .catch(error => console.log(error))
    }
  }
  scrollToBottom() {
    this.messagesList.scrollIntoView({block: "end"})
  }
  renderMessages() {
    const pritifyTime = timestamp => {
      const parsed = new Date(Date.parse(timestamp))
      const hours = parsed.getHours().toString()
      const minutes = parsed.getMinutes().toString()
      return (
        (hours.length < 2 ? `0${hours}` : hours)
        + ':' +
        (minutes.length < 2 ? `0${minutes}` : minutes)
      )
    }
    return(
      this.state.messagesList.map( message =>
        <Message
          key = { message.id }
          text = { message.body }
          time = { pritifyTime(message.created_at) }
          own  = { message.addresser_id == this.props.userId }
        />
      )
    )
  }
  render() {
    return(
      <div>
        <button
          type = "button"
          className ="btn btn-default attachment"
          children = { <span className = "glyphicon glyphicon-plus" aria-hidden="true"/> }
        />
        <input
          className = 'input-container'
          placeholder = 'Write a message'
          value = { this.state.messageText }
          onChange = { e => this.handleChange(e) }
          onKeyUp = { e => this.handleEnterKeyPress(e) }
        />
        <button
          type = "button"
          className = "btn btn-default send"
          onClick = { () => this.handleSubmit() }
          children = {<span className = "glyphicon glyphicon-send" aria-hidden="true"/>}
        />
        <div
          className = 'message-list'
          ref = { node => this.messagesList = node }
          children = { this.renderMessages() }
        />
      </div>
    )
  }
}

Chat.propTypes = {
  roomId: PropTypes.string,
  userId: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  let node = document.getElementById('chat-room')
  if(node){
    ReactDOM.render(
      <Chat
        roomId = { node.getAttribute('data-room-id') }
        userId = { node.getAttribute('data-user-id') }
      />, node
    )
  }

})
