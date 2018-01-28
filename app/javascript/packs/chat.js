import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import 'typeface-roboto/index.css'
import 'stylesheets/chat/chat.css'
import tone from 'media/tone.mp3'
import Input from '../components/Input'
import MessagesList from '../components/MessagesList'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

axios.defaults.headers.common = {
  'X-CSRF-TOKEN': document.getElementsByName('csrf-token')[0].content,
}

class Chat extends Component {
  static isInViewport(element) {
    const rect = element.getBoundingClientRect()
    const html = document.documentElement
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    )
  }
  constructor(props) {
    super(props)
    this.state = {
      chatHeader: '',
      online: false,
      lastSeen: 'Never',
      roomId: null,
      messagesList: {},
      usersList: [],
      sentMessagesCounter: {},
      newMessagesCounter: {},
      inputText: {},
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setRoom = this.setRoom.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.newMessageTone = new Audio(tone)
  }
  componentDidMount() {
    this.fetchUsers()
    this.fetchCounters()
    this.createMessagesSubscription()
    this.createUserSubscription()
    if (this.props.roomId && !this.state.roomId) {
      this.setRoom(
        this.props.roomId, this.props.roomName,
        this.props.lastSeenAt, this.props.online,
      )
    }
  }
  setRoom(id, name, lastSeen, online) {
    this.setState({
      roomId: id,
      messagesList: {},
      newMessagesCounter: {
        ...this.state.newMessagesCounter,
        [id]: 0,
      },
      chatHeader: name,
      lastSeen,
      online,
    })
    this.fetchMessages(id)
  }
  scrollToBottom() {
    this.messagesList.scrollIntoView(false)
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
            newMessagesCounter: {
              ...this.state.newMessagesCounter,
              [room]: 0,
            },
          })
        }
        if (this.state.roomId !== room || !document.hasFocus()) {
          this.newMessageTone.play()
        }
        this.setState({
          messagesList: {
            ...this.state.messagesList,
            [room]: [...this.state.messagesList[room], data],
          },
          newMessagesCounter: {
            ...this.state.newMessagesCounter,
            [room]: this.state.newMessagesCounter[room] +
            ((room === this.state.roomId || data.addresser_id === this.props.userId) &&
              document.hasFocus()
              ? 0
              : 1),
          },
        })
        if (this.state.roomId === room && Chat.isInViewport(this.messagesList.lastChild)) {
          this.scrollToBottom()
        }
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
        this.scrollToBottom()
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
  handleInputChange(text) {
    this.setState({
      inputText: {
        ...this.state.inputText,
        [this.state.roomId]: text,
      },
      newMessagesCounter: {
        ...this.state.newMessagesCounter,
        [this.state.roomId]: 0,
      },
    })
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
          inputText: {
            ...this.state.inputText,
            [id]: '',
          },
        })
        this.scrollToBottom()
      })
  }

  renderMessagesContainer() {
    return (
      <div className = 'messages-container'>
        <Header
          text = { this.state.chatHeader }
          lastSeen = { this.state.lastSeen }
          online = { this.state.online }
        />
        <MessagesList
          messages = { this.state.messagesList[this.state.roomId] }
          userId = { this.props.userId }
          ref = { (list) => { if (list) { this.messagesList = list.messagesList } } }
        />
        <Input
          placeholder = 'Write a message...'
          text = { this.state.inputText[this.state.roomId] }
          submitHandler = { this.handleSubmit }
          inputChangeHandler = { this.handleInputChange }
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
          <div className = 'empty-chat'>Click on user to start dialog</div> }
        { this.state.roomId && this.renderMessagesContainer() }
      </div>
    )
  }
}
Chat.defaultProps = {
  roomId: null,
  roomName: '',
  lastSeenAt: 'Never',
  online: false,
}
Chat.propTypes = {
  userId: PropTypes.number.isRequired,
  roomId: PropTypes.number,
  roomName: PropTypes.string,
  lastSeenAt: PropTypes.string,
  online: PropTypes.bool,
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
