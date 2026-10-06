import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const [score, setScore] = useState(0)
  const [timeTakenInSeconds, setTimeTakenInSeconds] = useState(0)
  const [formattedTime, setFormattedTime] = useState('00:00:00')
  const [isTimeUp, setIsTimeUp] = useState(false)

  const checkAuthentication = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/me', {
        method: 'GET',
        credentials: 'include',
      })

      setIsAuthenticated(response.ok)
    } catch (error) {
      console.error('AUTH CHECK ERROR:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  const login = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('LOGOUT ERROR:', error)
    }

    setIsAuthenticated(false)
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

  if (loading) {
    return null
  }

  return (
    <EvaluationContext.Provider value={contextValue}>
      {children}
    </EvaluationContext.Provider>
  )
}

export default EvaluationContext