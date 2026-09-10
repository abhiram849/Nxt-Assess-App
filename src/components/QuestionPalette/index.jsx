import React from 'react'
import AssessmentConfiguration from '../AssessmentConfiguration/index.jsx'
import Timer from '../Timer/index.jsx'
import QuestionNumberItem from '../QuestionNumberItem/index.jsx'
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
  return (
    <div className="question-palette-container">
      <div className="timer-config-row">
        <Timer timeRemainingInSeconds={timeRemainingInSeconds} />
        <AssessmentConfiguration
          answeredCount={answeredCount}
          unansweredCount={unansweredCount}
        />
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

            return (
              <QuestionNumberItem
                key={question.id}
                questionNumber={index + 1}
                isActive={isActive}
                isAnswered={isAnswered}
                onClickQuestionNumber={() => onSelectQuestion(index)}
              />
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
