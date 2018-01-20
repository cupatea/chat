import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Input extends Component{
  constructor(props){
    super(props)
    this.state = {
      text: '',
    }
  }
  componentDidMount(){
    this.textInput.focus()
  }
  handleChange(event){
    this.setState({ text: event.target.value })
  }
  handleEnterKeyPress(event){
    if(event.keyCode === 13){
      event.preventDefault()
      this.handleSubmit()
    }
  }
  handleSubmit(){
    if(this.state.text){
      this.props.submitHandler(this.state.text, this.props.roomId)
      this.setState({
        text: ''
      })
    }
  }
  render(){
    return(
      <div>
        <button
          type = "button"
          className ="btn btn-default attachment"
          children = { <span className = "glyphicon glyphicon-plus" aria-hidden="true"/> }
        />
        <input
          className = 'input-container'
          ref={ input => this.textInput = input }
          placeholder = 'Write a message'
          value = { this.state.text }
          onChange = { e => this.handleChange(e) }
          onKeyUp = { e => this.handleEnterKeyPress(e) }
        />
        <button
          type = "button"
          className = "btn btn-default send"
          onClick = { () => this.handleSubmit() }
          children = {<span className = "glyphicon glyphicon-send" aria-hidden="true"/>}
        />
      </div>
    )
  }
}

Input.defaultProps = {
  placeholder: '',
  roomId: null,
  submitHandler:() => {},
}

Input.propTypes = {
  placeholder: PropTypes.string,
  roomId: PropTypes.string,
  submitHandler: PropTypes.func,
}

export default Input
