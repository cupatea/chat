import React from 'react'
import PropTypes from 'prop-types'
import '../styles/User.css'

const User = props => (
  <button
    className = { `user-container${props.current ? ' active' : ''}` }
    onClick = { () => props.clicked(props.id, props.name, props.lastSeen, props.online) }
  >
    <div className = 'user-circle-avatar' >
      { props.name && props.name.charAt(0) }
    </div>
    { props.newCount > 0 &&
      <span className = 'user-circle-counter' >
        { props.newCount }
      </span>
    }
    <div className = 'user-info'>
      { props.online && <span className = 'user-online' /> }
      { !props.online && <span className = 'user-offline' /> }
      <span className = 'user-name' >
        { props.name }
      </span>
    </div>
  </button>
)

User.defaultProps = {
  name: '',
  id: '',
  online: false,
  lastSeen: 'never',
  current: false,
  newCount: 0,
  clicked: () => {},
}

User.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  online: PropTypes.bool,
  lastSeen: PropTypes.string,
  current: PropTypes.bool,
  newCount: PropTypes.number,
  clicked: PropTypes.func,
}

export default User
