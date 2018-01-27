import React from 'react'
import PropTypes from 'prop-types'
import 'stylesheets/chat/Filter.css'

const Filter = props => (
  <div>
    <input
      className = 'filter'
      type = 'text'
      placeholder = { props.placeholder }
      onKeyUp = { event => props.onTextChange(event.target.value) }
    />
  </div>
)

Filter.defaultProps = {
  placeholder: '',
  onTextChange: () => {},
}

Filter.propTypes = {
  placeholder: PropTypes.string,
  onTextChange: PropTypes.func,
}

export default Filter
