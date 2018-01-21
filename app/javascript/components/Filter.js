import React from 'react'
import PropTypes from 'prop-types'

const Filter = props => (
  <div>
    <input
      className = 'filter'
      type = "text"
      placeholder = { props.placeholder }
      onKeyUp={ event => props.onTextChange(event.target.value) }
    />
  </div>
)

Filter.defaultProps = {
  placeholder: '',
  onTextChange:() => {},
}

Filter.propTypes = {
  placeholder: PropTypes.string,
  submitHandler: PropTypes.func,
}

export default Filter
