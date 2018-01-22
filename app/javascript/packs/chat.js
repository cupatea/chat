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
      counters: {
        sentMessages: {},
        newMessages: {},
      },
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setRoom = this.setRoom.bind(this)
  }
  componentDidMount() {
    this.fetchUsers()
    this.fetchCounters()
    this.createMessagesSubscription()
  }
  setRoom(id) {
    this.setState({ roomId: id })
    this.setState({
      messagesList: {},
      counters: {
        ...this.state.counters,
        newMessages: {
          ...this.state.counters.newMessages,
          [this.state.roomId]: 0,
        },
      },
    })
    this.fetchMessages()
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
            counters: {
              ...this.state.counters,
              newMessages: {
                ...this.state.counters.newMessages,
                [room]: 0,
              },
            },
          })
        }
        this.setState({
          messagesList: {
            ...this.state.messagesList,
            [room]: [...this.state.messagesList[room], data],
          },
          counters: {
            ...this.state.counters,
            newMessages: {
              ...this.state.counters.newMessages,
              [room]: this.state.counters.newMessages[room] + (room === this.state.roomId ? 0 : 1),
            },
          },
        })
      },
    })
  }
  fetchMessages() {
    axios.get(`chats/messages?id=${this.state.roomId}`)
      .then((response) => {
        this.setState({
          messagesList: {
            [this.state.roomId]: response.data,
          },
          chatHeader: this.state.usersList.find(user => user.id === this.state.roomId).name,
        })
      })
      // .catch(error => console.error(error))
  }
  fetchUsers() {
    axios.get('chats/users')
      .then((response) => {
        this.setState({
          usersList: response.data,
        })
      })
      // .catch(error => console.log(error))
  }
  fetchCounters() {
    axios.get('chats/counter')
      .then((response) => {
        this.setState({
          counters: {
            ...this.state.counters,
            sentMessages: response.data,
          },
        })
      })
      // .catch(error => console.log(error))
  }
  handleSubmit(messageText, id) {
    axios.post('messages', {
      message: {
        body: messageText,
        addressee_id: id,
      },
    })
      .then(() => {
        const messages = this.state.counters.sentMessages[id]
        this.setState({
          counters: {
            ...this.state.counters,
            sentMessages: {
              ...this.state.counters.sentMessages,
              [id]: messages ? messages + 1 : 1,
            },
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
          sentCounter = { this.state.counters.sentMessages }
          newCounter = { this.state.counters.newMessages }
          setRoomHandler = { this.setRoom }
        />
        { !this.state.roomId && <Header text = 'Click on user to start dialog' /> }
        { this.state.roomId && this.renderMessagesContainer() }
      </div>
    )
  }
}
Chat.defaultTypes = {
  userId: null,
}
Chat.propTypes = {
  userId: PropTypes.number.isRequired,
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('chat-room')
  if (node) { ReactDOM.render(<Chat userId = { +node.getAttribute('data-user-id') } />, node) }
})
