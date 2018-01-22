import React from 'react'
import PropTypes from 'prop-types'

const User = props => (
  <button
    className = { `user-container${props.current ? ' active' : ''}` }
    onClick = { () => props.clicked(props.id, props.name) }
  >
    <div className = 'user-circle-avatar' >
      { props.name && props.name.charAt(0) }
    </div>
    <div className = 'user-info'>
      <span className = 'user-counter'>
        { props.sentCount || 0 }
      </span>
      <span className = 'user-counter' >
        { props.newCount || '' }
      </span>
      <span className = 'user-name' >
        { props.name }
      </span>
    </div>
  </button>
)

User.defaultProps = {
  name: '',
  id: '',
  current: false,
  sentCount: 0,
  newCount: 0,
  clicked: () => {},
}

User.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  current: PropTypes.bool,
  sentCount: PropTypes.number,
  newCount: PropTypes.number,
  clicked: PropTypes.func,
}

export default User
