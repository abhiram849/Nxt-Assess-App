import React from 'react'
import ButtonOptionItem from '../ButtonOptionItem/index.jsx'
import ImageOptionItem from '../ImageOptionItem/index.jsx'
import Select from '../Select/index.jsx'
import './index.css'

const Question = ({
  question,
  selectedOption,
  onSelectOption,
  isLastQuestion,
  onClickNextQuestion,
}) => {
  const {question_text, options_type, options} = question

  const selectedOptionId = selectedOption

  const renderOptions = () => {
    switch (options_type) {
      case 'DEFAULT':
        return (
          <ul className="default-options-list">
            {options.map(option => (
              <ButtonOptionItem
                key={option.id}
                option={option}
                isSelected={selectedOptionId === option.id}
                onClickOption={() => onSelectOption(option.id)}
              />
            ))}
          </ul>
        )

      case 'IMAGE':
        return (
          <ul className="image-options-list">
            {options.map(option => (
              <ImageOptionItem
                key={option.id}
                option={option}
                isSelected={selectedOptionId === option.id}
                onClickOption={() => onSelectOption(option.id)}
              />
            ))}
          </ul>
        )

      case 'SINGLE_SELECT':
        return (
          <Select
            options={options}
            selectedOptionId={selectedOptionId || options[0]?.id}
            onChangeOption={e => onSelectOption(e.target.value)}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <p className="question-text">{question_text}</p>
      </div>

      <hr className="question-divider" />

      <div className="options-container">{renderOptions()}</div>

      {!isLastQuestion && (
        <div className="next-question-btn-container">
          <button
            type="button"
            className="next-question-button"
            onClick={onClickNextQuestion}
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  )
}

export default Question
