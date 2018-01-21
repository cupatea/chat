import React from 'react'
import PropTypes from 'prop-types'

const User = props => (
  <div className = { `user-container${ props.current ? ' active' : '' }` }>
    <div className = 'user-circle-avatar' >
      { props.name.charAt(0) }
    </div>
    <div className = 'user-name'>
      <span className = 'user-counter' children = { props.counter || 0 } />
      <span children = { props.name } />
    </div>
  </div>
)

User.defaultProps = {
  name: '',
  id: '',
  current: false,
}

User.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  counter: PropTypes.number,
  current: PropTypes.bool,
}

export default User
