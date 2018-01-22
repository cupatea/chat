import React from 'react'
import PropTypes from 'prop-types'

const Message = props => (
  <div className = { props.own ? 'sended-container' : 'received-container' } >
    <div className = { props.own ? 'sended-color message' : 'received-color message' }>
      <span className = 'text'>
        { props.text }
      </span>
      <span className = 'time'>
        { props.time }
      </span>
    </div>
  </div>
)

Message.defaultProps = {
  own: false,
  text: '',
  time: '',
}

Message.propTypes = {
  own: PropTypes.bool,
  text: PropTypes.string,
  time: PropTypes.string,
}

export default Message
