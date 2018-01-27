import React from 'react'
import PropTypes from 'prop-types'
import '../styles/Header.css'

const Header = props => (
  <div className = 'header-container' >
    <span className = 'header-title'>{ props.text }</span>
    { props.online
      ? <span className = 'header-subtitle'>Active now</span>
      : <span className = 'header-subtitle'>Active { props.lastSeen }</span>
    }
  </div>
)

Header.defaultProps = {
  text: '',
  lastSeen: '',
  online: false,
}

Header.propTypes = {
  text: PropTypes.string,
  lastSeen: PropTypes.string,
  online: PropTypes.bool,
}

export default Header
