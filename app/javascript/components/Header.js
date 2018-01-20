import React from 'react'
import PropTypes from 'prop-types'

const Header = props => (
  <div className = 'header-container' >
    <h4 className = 'header-title'>{ props.name }</h4>  
  </div>
)

Header.defaultProps = {
  name: ''
}

Header.propTypes = {
  name: PropTypes.string,
}

export default Header
