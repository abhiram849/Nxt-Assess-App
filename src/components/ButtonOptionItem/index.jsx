import React from 'react'
import './index.css'

const ButtonOptionItem = ({option, isSelected, onClickOption}) => {
  const {text} = option
  const buttonClassName = isSelected
    ? 'default-option-btn selected-default-option'
    : 'default-option-btn'

  return (
    <li className="default-option-item">
      <button type="button" className={buttonClassName} onClick={onClickOption}>
        {text}
      </button>
    </li>
  )
}

export default ButtonOptionItem
