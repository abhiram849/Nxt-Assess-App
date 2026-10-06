import React from 'react'
import './index.css'

const QuestionPalette = ({
  questions,
  activeQuestionIndex,
  userAnswers,
  onSelectQuestion,
  onSubmitAssessment,
  answeredCount,
  unansweredCount,
  timeRemainingInSeconds,
}) => {
  const hours = Math.floor(timeRemainingInSeconds / 3600)

  const minutes = Math.floor((timeRemainingInSeconds % 3600) / 60)

  const seconds = timeRemainingInSeconds % 60

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="question-palette-container">
      <div className="timer-config-row">
        <div className="timer-container">
          <p className="timer-heading">Time Left</p>

          <p className="timer-display">{formattedTime}</p>
        </div>

        <div className="assessment-configuration-container">
          <div className="status-item answered-item">
            <p className="status-count answered-count">{answeredCount}</p>

            <p className="status-label">Answered Questions</p>
          </div>

          <div className="status-item unanswered-item">
            <p className="status-count unanswered-count">{unansweredCount}</p>

            <p className="status-label">Unanswered Questions</p>
          </div>
        </div>
      </div>

      <hr className="palette-separator" />

      <div className="palette-questions-section">
        <h2 className="palette-questions-heading">
          Questions ({questions.length})
        </h2>

        <ul className="palette-numbers-list">
          {questions.map((question, index) => {
            const isAnswered = Boolean(userAnswers[question.id])

            const isActive = index === activeQuestionIndex

            let buttonClass = 'question-number-btn'

            if (isActive) {
              buttonClass += ' active-question-btn'
            } else if (isAnswered) {
              buttonClass += ' answered-question-btn'
            }

            return (
              <li key={question.id} className="question-number-item">
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => onSelectQuestion(index)}
                >
                  {index + 1}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <button
        type="button"
        className="submit-assessment-button"
        onClick={onSubmitAssessment}
      >
        Submit Assessment
      </button>
    </div>
  )
}

export default QuestionPalette
