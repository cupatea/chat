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
      roomId: null,
      messagesList: {1:[]},
      usersList: [],
      countersObject: {},
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setRoom = this.setRoom.bind(this)
  }
  componentDidMount(){
    this.fetchUsers()
    this.fetchCounters()
    this.createMessagesSubscription()
  }
  componentDidUpdate(previousProps, previousState){
    if(this.state.roomId && this.state.roomId != previousState.roomId ){
      this.setState({ messagesList: {}})
      this.fetchMessages()
    }
  }
  createMessagesSubscription(){
    App.messages = App.cable.subscriptions.create('MessagesChannel',{
      received: data => {
        const room = data.addressee_id == this.props.userId ? data.addresser_id : data.addressee_id
        this.setState({
          messagesList: {
            ...this.state.messagesList,
            [room]: [...this.state.messagesList[room], data]
          }
        })
      }
    })
  }
  fetchMessages(){
    axios.get(`chats/messages?id=${this.state.roomId}`)
    .then(response => {
      this.state.messagesList[this.state.roomId] |= []
      this.setState({
        messagesList: {
          [this.state.roomId]: response.data
        },
        chatHeader: this.state.usersList.find(user => user.id == this.state.roomId).name
      })
    })
    .catch(error => console.log(error))
  }
  fetchUsers(){
    axios.get('chats/users')
    .then(response => this.setState({
      usersList: response.data,
    }))
    .catch(error => console.log(error))
  }
  fetchCounters(){
    axios.get('chats/counter')
    .then(response => this.setState({
      countersObject: response.data,
    }))
    .catch(error => console.log(error))
  }
  handleSubmit(messageText,addressee_id ){
    axios.post('messages',{
      message:{
        body: messageText,
        addressee_id: addressee_id,
      }
    })
    .then(response => this.setState({
      countersObject:{
        ...this.state.countersObject,
        [addressee_id]: this.state.countersObject[addressee_id] +1
      }
    }))
  }
  setRoom(id){
    this.setState({roomId: id})
  }
  renderMessagesContainer(){
    return(
      <div className = 'messages-container'>
        <Header
          text = { this.state.chatHeader }
        />
        <MessagesList
          messages = { this.state.messagesList[this.state.roomId] }
          userId = { this.props.userId }
        />
        <Input
          placeholder = 'Write a message...'
          submitHandler = { this.handleSubmit }
          roomId = { this.state.roomId }
        />
      </div>
    )
  }
  render(){
    return(
      <div className = 'chat-container'>
        <Sidebar
          users = { this.state.usersList }
          currentUserId = { this.state.roomId }
          counters = { this.state.countersObject }
          setRoomHandler = { this.setRoom }
        />
        { !this.state.roomId &&   <Header text = 'Click on user to start dialog'/> }
        { this.state.roomId && this.renderMessagesContainer() }
      </div>
    )
  }
}

Chat.propTypes = {
  userId: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  let node = document.getElementById('chat-room')
  if(node){
    ReactDOM.render(<Chat userId = { node.getAttribute('data-user-id') }/>, node)
  }
})
