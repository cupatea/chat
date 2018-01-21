import React from 'react'
import PropTypes from 'prop-types'

const User = props => (
  <button
    className = { `user-container${ props.current ? ' active' : '' }` }
    onClick = { () => props.clicked(props.id) }
  >
    <div className = 'user-circle-avatar' >
      { props.name && props.name.charAt(0) }
    </div>
    <div className = 'user-name'>
      <span className = 'user-counter' children = { props.counter || 0 } />
      <span children = { props.name } />
    </div>
  </button>
)

User.defaultProps = {
  name: '',
  id: '',
  current: false,
  clicked: () => {},
}

User.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  counter: PropTypes.number,
  current: PropTypes.bool,
  clicked: PropTypes.func
}

export default User
