import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import Input from '../components/Input'
import MessagesList from '../components/MessagesList'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

axios.defaults.headers.common = {
  'X-CSRF-TOKEN': document.getElementsByName('csrf-token')[0].content,
}

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chatHeader: '',
      roomId: null,
      messagesList: {},
      usersList: [],
      sentMessagesCounter: {},
      newMessagesCounter: {},
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setRoom = this.setRoom.bind(this)
  }
  componentDidMount() {
    this.fetchUsers()
    this.fetchCounters()
    this.createMessagesSubscription()
    this.createUserSubscription()
    if (this.props.roomId && !this.state.roomId) {
      this.setRoom(this.props.roomId, this.props.roomName)
    }
  }
  setRoom(id, name) {
    this.setState({
      roomId: id,
      messagesList: {},
      newMessagesCounter: {
        ...this.state.newMessagesCounter,
        [id]: 0,
      },
      chatHeader: name,
    })
    this.fetchMessages(id)
  }
  createMessagesSubscription() {
    App.messages = App.cable.subscriptions.create('MessagesChannel', {
      received: (data) => {
        const room = data.addressee_id === this.props.userId ? data.addresser_id : data.addressee_id
        //  It's incoming message from the chat that's not curently active, isn't it?
        if (!this.state.messagesList[room]) {
          this.setState({
            // It's better to create keys beforehand
            messagesList: {
              ...this.state.messagesList,
              [room]: [],
            },
          })
        }
        this.setState({
          messagesList: {
            ...this.state.messagesList,
            [room]: [...this.state.messagesList[room], data],
          },
          newMessagesCounter: {
            ...this.state.newMessagesCounter,
            [room]: this.state.newMessagesCounter[room] +
            (room === this.state.roomId || data.addresser_id === this.props.userId ? 0 : 1),
          },
        })
      },
    })
  }
  createUserSubscription() {
    App.users = App.cable.subscriptions.create('UsersChannel', {
      received: (data) => {
        const updatedUsersList = this.state.usersList.map(user => (user.id === data.id
          ? { ...user, ...data }
          : user
        ))
        this.setState({ usersList: updatedUsersList })
      },
    })
  }
  fetchMessages(id) {
    axios.get(`/chats/messages?id=${id}`)
      .then((response) => {
        this.setState({
          messagesList: {
            [id]: response.data,
          },
        })
      })
      // .catch(error => console.error(error))
  }
  fetchUsers() {
    axios.get('/chats/users')
      .then((response) => {
        this.setState({
          usersList: response.data,
        })
      })
      // .catch(error => console.log(error))
  }
  fetchCounters() {
    axios.get('/chats/counter')
      .then((response) => {
        this.setState({
          sentMessagesCounter: response.data,
        })
      })
      // .catch(error => console.log(error))
  }
  handleSubmit(messageText, id) {
    axios.post('/messages', {
      message: {
        body: messageText,
        addressee_id: id,
      },
    })
      .then(() => {
        const messages = this.state.sentMessagesCounter[id]
        this.setState({
          sentMessagesCounter: {
            ...this.state.sentMessagesCounter,
            [id]: messages ? messages + 1 : 1,
          },
        })
      })
  }

  renderMessagesContainer() {
    return (
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
  render() {
    return (
      <div className = 'chat-container'>
        <Sidebar
          users = { this.state.usersList }
          currentUserId = { this.state.roomId }
          sentCounter = { this.state.sentMessagesCounter }
          newCounter = { this.state.newMessagesCounter }
          setRoomHandler = { this.setRoom }
        />
        { !this.state.roomId && !this.props.roomId &&
          <Header text = 'Click on user to start dialog' /> }
        { this.state.roomId && this.renderMessagesContainer() }
      </div>
    )
  }
}
Chat.defaultProps = {
  roomId: null,
  roomName: '',
}
Chat.propTypes = {
  userId: PropTypes.number.isRequired,
  roomId: PropTypes.number,
  roomName: PropTypes.string,
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('chat-room')
  if (node) {
    ReactDOM.render(<Chat
      userId = { +node.getAttribute('data-user-id') }
      roomId = { +node.getAttribute('data-room-id') }
      roomName = { node.getAttribute('data-room-name') }
    />, node)
  }
})
