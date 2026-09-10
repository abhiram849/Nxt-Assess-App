import React from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header/index.jsx'
import './index.css'

const Home = () => {
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content-card">
          <div className="instructions-container">
            <h1 className="instructions-heading">Instructions</h1>

            <ol className="instructions-list">
              <li className="instruction-item">
                <span className="instruction-bold">Total Questions: </span>10
              </li>

              <li className="instruction-item">
                <span className="instruction-bold">Types of Questions: </span>
                MCQs
              </li>

              <li className="instruction-item">
                <span className="instruction-bold">Duration: </span>10 Mins
              </li>

              <li className="instruction-item">
                <span className="instruction-bold">Marking Scheme: </span>
                Every Correct response, get 1 mark
              </li>

              <li className="instruction-item">
                All the progress will be lost, if you reload during the
                assessment
              </li>
            </ol>

            <Link to="/assessment">
              <button type="button" className="start-assessment-button">
                Start Assessment
              </button>
            </Link>
          </div>

          <div className="home-image-container">
            <img
              src="/assets/assessment.svg"
              alt="assessment"
              className="assessment-image"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
