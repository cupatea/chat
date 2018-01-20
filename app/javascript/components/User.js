import React from 'react'
import PropTypes from 'prop-types'

const User = props => (
  <div className = 'user-container'>
    <div className = 'user-circle-avatar' >
      { props.name.charAt(0) }
    </div>
    <div className = 'user-name'>
      <span className = 'user-counter' children = { props.counter } />
      <span children = { props.name } />
    </div>
  </div>
)

User.defaultProps = {
  name: '',
  id: '',
}

User.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  counter: PropTypes.number,
}

export default User
