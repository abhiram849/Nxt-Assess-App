import React from 'react'
import ButtonOptionItem from '../ButtonOptionItem'
import ImageOptionItem from '../ImageOptionItem'
import Select from '../Select'
import './index.css'

const Question = ({
  question,
  questionNumber,
  selectedOptionId,
  onSelectOption,
  isLastQuestion,
  onClickNextQuestion,
}) => {
  const {
    question_text: questionText,
    options_type: optionsType,
    options = [],
  } = question

  const renderOptions = () => {
    if (optionsType === 'DEFAULT') {
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
    }

    if (optionsType === 'IMAGE') {
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
    }

    if (optionsType === 'SINGLE_SELECT') {
      return (
        <Select
          options={options}
          selectedOptionId={selectedOptionId}
          onChangeOption={event => onSelectOption(event.target.value)}
        />
      )
    }

    return null
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <p className="question-text">{questionText}</p>
      </div>

      <hr className="question-divider" />

      <div className="options-container">{renderOptions()}</div>

      <div className="next-question-btn-container">
        {!isLastQuestion && (
          <button
            type="button"
            className="next-question-button"
            onClick={onClickNextQuestion}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}

export default Question
