import React from 'react'
import './index.css'

const QuestionNumberItem = ({
  questionNumber,
  isActive,
  isAnswered,
  onClickQuestionNumber,
}) => {
  let buttonClassName = 'question-number-btn'
  if (isActive) {
    buttonClassName += ' active-question-btn'
  } else if (isAnswered) {
    buttonClassName += ' answered-question-btn'
  }

  return (
    <li className="question-number-item">
      <button
        type="button"
        className={buttonClassName}
        onClick={onClickQuestionNumber}
      >
        {questionNumber}
      </button>
    </li>
  )
}

export default QuestionNumberItem
