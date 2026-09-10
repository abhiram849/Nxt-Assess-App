import React from 'react'
import './index.css'

const ImageOptionItem = ({option, isSelected, onClickOption}) => {
  const {image_url, text} = option
  const containerClassName = isSelected
    ? 'image-option-item selected-image-option'
    : 'image-option-item'

  return (
    <li className={containerClassName}>
      <button
        type="button"
        className="image-option-btn"
        onClick={onClickOption}
      >
        <img src={image_url} alt={text} className="option-image" />
      </button>
    </li>
  )
}

export default ImageOptionItem
