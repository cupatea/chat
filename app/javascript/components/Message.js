import React from 'react'
import PropTypes from 'prop-types'

const Message = props => (
  <div className = { props.own ? 'sended-container' : 'received-container' } >
    <div className = { props.own ? 'sended-color message' : 'received-color message' }>
      <span className = 'text' children = { props.text }/>
      <span className = 'time' children = { props.time }/>
    </div>
  </div>
)

Message.defaultProps = {
  text: '',
  time: '',
}

Message.propTypes = {
  text: PropTypes.string,
  time: PropTypes.string,
}

export default Message
