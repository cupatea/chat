import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import Input from '../components/Input'
import MessagesList from '../components/MessagesList'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

axios.defaults.headers.common = {
  'X-CSRF-TOKEN' : document.getElementsByName('csrf-token')[0].content
}

class Chat extends Component {
  constructor(props){
    super(props)
    this.state = {
      chatHeader: '',
      messagesList: [],
      usersList: [],
      countersObject: {},
    }
  }
  componentDidMount(){
    this.fetchMessages()
    this.createMessagesSubscription()
    this.fetchUsers()
    this.fetchCounters()
  }
  createMessagesSubscription(){
    App.messages = App.cable.subscriptions.create('MessagesChannel',{
      received: data => this.setState({
        messagesList: [...this.state.messagesList, data]
      })
    })
  }
  fetchMessages(){
    axios.get(`${this.props.roomId}/messages`)
    .then(response => this.setState({
      messagesList: response.data
    }))
    .catch(error => console.log(error))
  }
  fetchUsers(){
    axios.get(`${this.props.roomId}/users`)
    .then(response => this.setState({
      usersList: response.data,
      chatHeader: response.data.find(user => user.id == this.props.roomId).name
    }))
    .catch(error => console.log(error))
  }
  fetchCounters(){
    axios.get(`${this.props.roomId}/counter`)
    .then(response => this.setState({
      countersObject: response.data,
    }))
    .catch(error => console.log(error))
  }
  handleSubmit(messageText,addressee_id ){
    axios.post(`/messages`,{
      message:{
        body: messageText,
        addressee_id: addressee_id,
      }
    })
  }
  render(){
    return(
      <div className = 'chat-container'>
        <Sidebar
          users = { this.state.usersList }
          counters = { this.state.countersObject }
        />
        <div className = 'messages-container'>
          <Header
            name = { this.state.chatHeader }
          />
          <MessagesList
            messages = { this.state.messagesList }
            userId = { this.props.userId }
          />
          <Input
            placeholder = 'Write a message...'
            submitHandler = { this.handleSubmit }
            roomId = { this.props.roomId }
          />
        </div>
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
