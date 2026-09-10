import React, {createContext, useState, useCallback, useMemo} from 'react'
import Cookies from 'js-cookie'

const EvaluationContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  score: 0,
  setScore: () => {},
  timeTakenInSeconds: 0,
  setTimeTakenInSeconds: () => {},
  formattedTime: '00:00:00',
  setFormattedTime: () => {},
  isTimeUp: false,
  setIsTimeUp: () => {},
  resetAssessment: () => {},
})

export const EvaluationProvider = ({children}) => {
  const getInitialToken = () => {
    return Cookies.get('jwt_token') || localStorage.getItem('jwt_token') || null
  }

  const [token, setToken] = useState(getInitialToken)
  const [score, setScore] = useState(0)
  const [timeTakenInSeconds, setTimeTakenInSeconds] = useState(0)
  const [formattedTime, setFormattedTime] = useState('00:00:00')
  const [isTimeUp, setIsTimeUp] = useState(false)

  const isAuthenticated = Boolean(token)

  const login = useCallback(jwtToken => {
    localStorage.setItem('jwt_token', jwtToken)
    setToken(jwtToken)
  }, [])

  const logout = useCallback(() => {
    Cookies.remove('jwt_token')
    localStorage.removeItem('jwt_token')
    setToken(null)
    setScore(0)
    setTimeTakenInSeconds(0)
    setFormattedTime('00:00:00')
    setIsTimeUp(false)
  }, [])

  const resetAssessment = useCallback(() => {
    setScore(0)
    setTimeTakenInSeconds(0)
    setFormattedTime('00:00:00')
    setIsTimeUp(false)
  }, [])

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      score,
      setScore,
      timeTakenInSeconds,
      setTimeTakenInSeconds,
      formattedTime,
      setFormattedTime,
      isTimeUp,
      setIsTimeUp,
      resetAssessment,
    }),
    [
      isAuthenticated,
      login,
      logout,
      score,
      timeTakenInSeconds,
      formattedTime,
      isTimeUp,
      resetAssessment,
    ],
  )

  return (
    <EvaluationContext.Provider value={contextValue}>
      {children}
    </EvaluationContext.Provider>
  )
}

export default EvaluationContext
