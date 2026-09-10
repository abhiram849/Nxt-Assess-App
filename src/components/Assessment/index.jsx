import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {useNavigate} from 'react-router-dom'
import EvaluationContext from '../../context/EvaluationContext.jsx'
import Header from '../Header/index.jsx'
import Question from '../Question/index.jsx'
import QuestionPalette from '../QuestionPalette/index.jsx'
import './index.css'

const questionsApiUrl = 'https://apis.ccbp.in/assess/questions'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const TOTAL_DURATION_IN_SECONDS = 600

const Assessment = () => {
  const {setScore, setTimeTakenInSeconds, setFormattedTime, setIsTimeUp} =
    useContext(EvaluationContext)

  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [timeRemainingInSeconds, setTimeRemainingInSeconds] = useState(
    TOTAL_DURATION_IN_SECONDS,
  )
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const timerRef = useRef(null)

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const calculateScore = useCallback(
    answers => {
      let totalScore = 0

      questions.forEach(question => {
        const selectedId = answers[question.id]

        const selectedOption = question.options.find(
          option => option.id === selectedId,
        )

        if (
          selectedOption &&
          (selectedOption.is_correct === 'true' ||
            selectedOption.is_correct === true)
        ) {
          totalScore += 1
        }
      })

      return totalScore
    },
    [questions],
  )

  const finishAssessment = useCallback(
    isTimeUpValue => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      const score = calculateScore(userAnswers)

      const timeTaken = isTimeUpValue
        ? TOTAL_DURATION_IN_SECONDS
        : TOTAL_DURATION_IN_SECONDS - timeRemainingInSeconds

      setScore(score)
      setTimeTakenInSeconds(timeTaken)
      setFormattedTime(formatTime(timeTaken))
      setIsTimeUp(isTimeUpValue)

      navigate('/results', {replace: true})
    },
    [
      calculateScore,
      navigate,
      setFormattedTime,
      setIsTimeUp,
      setScore,
      setTimeTakenInSeconds,
      timeRemainingInSeconds,
      userAnswers,
    ],
  )

  const getQuestions = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)

    try {
      const response = await fetch(questionsApiUrl)

      if (response.ok) {
        const data = await response.json()

        setQuestions(data.questions || [])
        setActiveQuestionIndex(0)

        // Do not automatically select any option.
        // Answered Questions count starts at 0.
        setUserAnswers({})

        setTimeRemainingInSeconds(TOTAL_DURATION_IN_SECONDS)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [])

  // Fetch questions when Assessment loads.
  useEffect(() => {
    getQuestions()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [getQuestions])

  // Start countdown only after questions are successfully loaded.
  useEffect(() => {
    if (apiStatus !== apiStatusConstants.success) {
      return undefined
    }

    timerRef.current = setInterval(() => {
      setTimeRemainingInSeconds(previousTime => {
        if (previousTime <= 1) {
          clearInterval(timerRef.current)
          return 0
        }

        return previousTime - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [apiStatus])

  // Automatically submit when timer reaches zero.
  useEffect(() => {
    if (
      apiStatus === apiStatusConstants.success &&
      timeRemainingInSeconds === 0
    ) {
      finishAssessment(true)
    }
  }, [apiStatus, finishAssessment, timeRemainingInSeconds])

  const onSelectOption = optionId => {
    const activeQuestion = questions[activeQuestionIndex]

    if (!activeQuestion) {
      return
    }

    setUserAnswers(previousAnswers => ({
      ...previousAnswers,
      [activeQuestion.id]: optionId,
    }))
  }

  const onSelectQuestionNumber = index => {
    setActiveQuestionIndex(index)
  }

  const onClickNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(previousIndex => previousIndex + 1)
    }
  }

  const answeredCount = Object.keys(userAnswers).length
  const unansweredCount = questions.length - answeredCount

  if (
    apiStatus === apiStatusConstants.initial ||
    apiStatus === apiStatusConstants.inProgress
  ) {
    return (
      <>
        <Header />
        <div className="loader-container" data-testid="loader">
          <div className="loader">Loading...</div>
        </div>
      </>
    )
  }

  if (apiStatus === apiStatusConstants.failure) {
    return (
      <>
        <Header />
        <div className="failure-view-container">
          <img
            src="/assets/failure.svg"
            alt="failure view"
            className="failure-image"
          />

          <h1 className="failure-heading">
            Oops! Something Went Wrong
          </h1>

          <p className="failure-description">
            We are having some trouble fetching the questions
          </p>

          <button
            type="button"
            className="retry-button"
            onClick={getQuestions}
          >
            Retry
          </button>
        </div>
      </>
    )
  }

  const activeQuestion = questions[activeQuestionIndex]

  if (!activeQuestion) {
    return null
  }

  return (
    <>
      <Header />

      <div className="assessment-container">
        <div className="assessment-main-content">
          <div className="assessment-body">
            <Question
              question={activeQuestion}
              questionNumber={activeQuestionIndex + 1}
              selectedOption={userAnswers[activeQuestion.id]}
              onSelectOption={onSelectOption}
              isLastQuestion={
                activeQuestionIndex === questions.length - 1
              }
              onClickNextQuestion={onClickNextQuestion}
            />

            <QuestionPalette
              questions={questions}
              activeQuestionIndex={activeQuestionIndex}
              userAnswers={userAnswers}
              onSelectQuestion={onSelectQuestionNumber}
              onSubmitAssessment={() => finishAssessment(false)}
              answeredCount={answeredCount}
              unansweredCount={unansweredCount}
              timeRemainingInSeconds={timeRemainingInSeconds}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Assessment