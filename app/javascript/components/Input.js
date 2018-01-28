import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-icons-kit'
import { send } from 'react-icons-kit/fa/send'
import { attachment } from 'react-icons-kit/icomoon/attachment'
import TextareaAutosize from 'react-autosize-textarea'
import 'stylesheets/chat/Input.css'

class Input extends Component {
  handleEnterKeyPress(event) {
    if (event.keyCode === 13) {
      event.preventDefault()
      this.handleSubmit()
    }
  }
  handleSubmit() {
    if (this.props.text) {
      this.props.submitHandler(this.props.text, this.props.roomId)
    }
  }
  render() {
    return (
      <div className = 'input-container'>
        <div className = 'button-container'>
          <button
            className = 'button attachment'
          >
            <Icon icon = { attachment } />
          </button>
        </div>
        <div className = 'textarea-container'>
          <TextareaAutosize
            className = 'textarea'
            autoFocus = 'true'
            placeholder = { this.props.placeholder }
            value = { this.props.text }
            onChange = { e => this.props.inputChangeHandler(e.target.value) }
            onKeyDown = { e => this.handleEnterKeyPress(e) }
          />
        </div>
        <div className = 'button-container'>
          { this.props.text.length }
        </div>
        <div className = 'button-container'>
          <button
            className = 'button send'
            onClick = { () => this.handleSubmit() }
          >
            <Icon icon = { send } />
          </button>
        </div>
      </div>
    )
  }
}

Input.defaultProps = {
  placeholder: '',
  text: '',
  roomId: null,
  submitHandler: () => {},
  inputChangeHandler: () => {},
}

Input.propTypes = {
  placeholder: PropTypes.string,
  text: PropTypes.string,
  roomId: PropTypes.number,
  submitHandler: PropTypes.func,
  inputChangeHandler: PropTypes.func,
}

export default Input
