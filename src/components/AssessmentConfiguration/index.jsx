import React from 'react'
import './index.css'

const AssessmentConfiguration = ({answeredCount, unansweredCount}) => {
  return (
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
  )
}

export default AssessmentConfiguration
