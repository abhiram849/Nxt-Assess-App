import React, {useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import EvaluationContext from '../../context/EvaluationContext.jsx'
import Header from '../Header/index.jsx'
import './index.css'

const Results = () => {
  const {score, formattedTime, isTimeUp, resetAssessment} =
    useContext(EvaluationContext)

  const navigate = useNavigate()

  const onClickReattempt = () => {
    resetAssessment()
    navigate('/assessment')
  }

  return (
    <>
      <Header />
      <div className="results-container">
        <div className="results-card">
          {isTimeUp ? (
            <div className="time-up-view">
              <img
                src="/assets/time-up.svg"
                alt="time up"
                className="results-image"
              />
              <h1 className="results-heading">Time is up!</h1>
              <p className="time-up-description">
                You did not complete the assessment within the time
              </p>
              <div className="results-details-container">
                <p className="results-label">Time Taken:</p>
                <p className="results-value">{formattedTime}</p>
                <p className="results-label">Your score:</p>
                <p className="results-value">{score}</p>
              </div>
              <button
                type="button"
                className="reattempt-button"
                onClick={onClickReattempt}
              >
                Reattempt
              </button>
            </div>
          ) : (
            <div className="submitted-view">
              <img
                src="/assets/submit.svg"
                alt="submit"
                className="results-image"
              />
              <h1 className="results-heading">
                Congrats! You completed the assessment
              </h1>
              <div className="results-details-container">
                <p className="results-label">Time Taken</p>
                <p className="results-value">{formattedTime}</p>

                <p className="results-label">Your score</p>
                <p className="results-value">{score}</p>
              </div>
              <button
                type="button"
                className="reattempt-button"
                onClick={onClickReattempt}
              >
                Reattempt
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Results
