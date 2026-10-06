import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {useNavigate} from 'react-router-dom'
import EvaluationContext from '../../context/EvaluationContext.jsx'
import Header from '../Header'
import Question from '../Question'
import QuestionPalette from '../QuestionPalette'
import Loader from '../Loader'
import './index.css'

const assessmentApiUrl = 'https://apis.ccbp.in/assess/questions'
const TOTAL_TIME = 10 * 60

const Assessment = () => {
  const {setScore, setTimeTakenInSeconds, setFormattedTime, setIsTimeUp} =
    useContext(EvaluationContext)

  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME)
  const [apiStatus, setApiStatus] = useState('INITIAL')

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
      let score = 0

      questions.forEach(question => {
        const selectedOptionId = answers[question.id]

        const selectedOption = question.options?.find(
          option => option.id === selectedOptionId,
        )

        if (
          selectedOption &&
          (selectedOption.is_correct === true ||
            selectedOption.is_correct === 'true')
        ) {
          score += 1
        }
      })

      return score
    },
    [questions],
  )

  const submitAssessment = useCallback(
    (isTimeUp = false) => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      const score = calculateScore(userAnswers)

      const timeTaken = isTimeUp ? TOTAL_TIME : TOTAL_TIME - timeRemaining

      setScore(score)
      setTimeTakenInSeconds(timeTaken)
      setFormattedTime(formatTime(timeTaken))
      setIsTimeUp(isTimeUp)

      navigate('/results', {replace: true})
    },
    [
      calculateScore,
      userAnswers,
      timeRemaining,
      setScore,
      setTimeTakenInSeconds,
      setFormattedTime,
      setIsTimeUp,
      navigate,
    ],
  )

  const getQuestions = async () => {
    setApiStatus('IN_PROGRESS')

    try {
      const response = await fetch(assessmentApiUrl)

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()

      const receivedQuestions = data.questions || []

      setQuestions(receivedQuestions)
      setTotalQuestions(
        typeof data.total === 'number' ? data.total : receivedQuestions.length,
      )

      setActiveQuestionIndex(0)
      setUserAnswers({})
      setTimeRemaining(TOTAL_TIME)

      setApiStatus('SUCCESS')
    } catch {
      setApiStatus('FAILURE')
    }
  }

  useEffect(() => {
    getQuestions()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  /*
   * Automatically select the first option when the
   * active question is SINGLE_SELECT.
   *
   * This also handles the FIRST question after the API
   * request succeeds.
   */
  useEffect(() => {
    if (apiStatus !== 'SUCCESS' || questions.length === 0) {
      return
    }

    const question = questions[activeQuestionIndex]

    if (!question) {
      return
    }

    if (
      question.options_type === 'SINGLE_SELECT' &&
      !userAnswers[question.id] &&
      question.options?.length > 0
    ) {
      setUserAnswers(previousAnswers => ({
        ...previousAnswers,
        [question.id]: question.options[0].id,
      }))
    }
  }, [apiStatus, questions, activeQuestionIndex, userAnswers])

  /*
   * Start countdown after successful API response.
   */
  useEffect(() => {
    if (apiStatus !== 'SUCCESS') {
      return undefined
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(previousTime => {
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

  useEffect(() => {
    if (apiStatus === 'SUCCESS' && timeRemaining === 0) {
      submitAssessment(true)
    }
  }, [apiStatus, timeRemaining, submitAssessment])

  /*
   * Selecting an option answers the question only once.
   *
   * Changing an already-selected answer does NOT change
   * the answered/unanswered counts.
   */
  const onSelectOption = optionId => {
    const question = questions[activeQuestionIndex]

    if (!question) {
      return
    }

    setUserAnswers(previousAnswers => ({
      ...previousAnswers,
      [question.id]: optionId,
    }))
  }

  const onClickQuestionNumber = index => {
    setActiveQuestionIndex(index)
  }

  const onClickNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(previousIndex => previousIndex + 1)
    }
  }

  const onRetry = () => {
    getQuestions()
  }

  if (apiStatus === 'INITIAL' || apiStatus === 'IN_PROGRESS') {
    return (
      <>
        <Header />
        <Loader />
      </>
    )
  }

  if (apiStatus === 'FAILURE') {
    return (
      <>
        <Header />

        <div className="failure-view-container">
          <img
            src="/assets/failure.svg"
            alt="failure view"
            className="failure-image"
          />

          <h1 className="failure-heading">Oops! Something went wrong</h1>

          <p className="failure-description">We are having some trouble</p>

          <button type="button" className="retry-button" onClick={onRetry}>
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

  const answeredCount = Object.keys(userAnswers).length

  const unansweredCount = Math.max(totalQuestions - answeredCount, 0)

  return (
    <>
      <Header />

      <div className="assessment-container">
        <div className="assessment-body">
          <Question
            question={activeQuestion}
            questionNumber={activeQuestionIndex + 1}
            selectedOptionId={userAnswers[activeQuestion.id]}
            onSelectOption={onSelectOption}
            isLastQuestion={activeQuestionIndex === questions.length - 1}
            onClickNextQuestion={onClickNextQuestion}
          />

          <QuestionPalette
            questions={questions}
            activeQuestionIndex={activeQuestionIndex}
            userAnswers={userAnswers}
            onSelectQuestion={onClickQuestionNumber}
            onSubmitAssessment={() => submitAssessment(false)}
            answeredCount={answeredCount}
            unansweredCount={unansweredCount}
            timeRemainingInSeconds={timeRemaining}
          />
        </div>
      </div>
    </>
  )
}

export default Assessment
