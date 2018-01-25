import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
      <div>
        <button
          type = 'button'
          className = 'btn btn-default attachment'
        >
          <span className = 'glyphicon glyphicon-plus' aria-hidden = 'true' />
        </button>
        <input
          className = 'input-container'
          ref = { (input) => { this.textInput = input } }
          placeholder = { this.props.placeholder }
          value = { this.props.text }
          onChange = { e => this.props.inputChangeHandler(e.target.value) }
          onKeyUp = { e => this.handleEnterKeyPress(e) }
        />
        <button
          type = 'button'
          className = 'btn btn-default send'
          onClick = { () => this.handleSubmit() }
        >
          <span className = 'glyphicon glyphicon-send' aria-hidden = 'true' />
        </button>
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
