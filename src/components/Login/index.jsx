import React, {useState, useContext} from 'react'
import {useNavigate, Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import EvaluationContext from '../../context/EvaluationContext.jsx'
import './index.css'

const loginApiUrl = 'https://apis.ccbp.in/login'

const Login = () => {
  const {isAuthenticated, login} = useContext(EvaluationContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onToggleShowPassword = () => {
    setShowPassword(previousState => !previousState)
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    login(jwtToken)
    navigate('/', {replace: true})
  }

  const onSubmitForm = async event => {
    event.preventDefault()

    setShowSubmitError(false)
    setErrorMsg('')

    if (username.trim() === '' || password === '') {
      setShowSubmitError(true)
      setErrorMsg('Username and Password are required')
      return
    }

    setIsLoading(true)

    const userDetails = {
      username: username.trim(),
      password,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(loginApiUrl, options)
      const data = await response.json()

      if (response.ok) {
        onSubmitSuccess(data.jwt_token)
      } else {
        setShowSubmitError(true)
        setErrorMsg(data.error_msg || 'Invalid username or password')
      }
    } catch (error) {
      console.error('Login API error:', error)
      setShowSubmitError(true)
      setErrorMsg('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-form-container">
      <div className="login-card-container">
        <div className="login-logo-container">
          <img
            src="/assets/nxt-assess-logo.svg"
            className="login-website-logo"
            alt="login website logo"
          />
        </div>

        <form className="form-container" onSubmit={onSubmitForm}>
          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>

            <input
              type="text"
              id="username"
              className="username-input-field"
              value={username}
              onChange={onChangeUsername}
            />
          </div>

          <div className="input-container">
            <label className="input-label" htmlFor="password">
              PASSWORD
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="password-input-field"
              value={password}
              onChange={onChangePassword}
            />
          </div>

          <div className="checkbox-container">
            <input
              id="showPasswordCheckbox"
              type="checkbox"
              className="checkbox-input"
              checked={showPassword}
              onChange={onToggleShowPassword}
            />

            <label
              htmlFor="showPasswordCheckbox"
              className="checkbox-label"
            >
              Show Password
            </label>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {showSubmitError && (
            <p className="error-message">*{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login