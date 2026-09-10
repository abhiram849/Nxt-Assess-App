import React from 'react'
import './index.css'

const Select = ({options, selectedOptionId, onChangeOption}) => {
  return (
    <div className="select-component-container">
      <div className="select-dropdown-wrapper">
        <select
          className="select-input"
          value={selectedOptionId}
          onChange={onChangeOption}
        >
          {options.map(option => (
            <option key={option.id} value={option.id} className="select-option">
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <p className="default-selected-text">
        First option is selected by default
      </p>
    </div>
  )
}

export default Select
