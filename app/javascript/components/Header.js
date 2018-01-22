import React from 'react'
import PropTypes from 'prop-types'

const Header = props => (
  <div className = 'header-container' >
    <h4 className = 'header-title'>{ props.text }</h4>
  </div>
)

Header.defaultProps = {
  text: '',
}

Header.propTypes = {
  text: PropTypes.string,
}

export default Header
