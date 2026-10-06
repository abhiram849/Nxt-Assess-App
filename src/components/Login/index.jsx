import React, {useContext, useState} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import EvaluationContext from '../../context/EvaluationContext'
import './index.css'

const Login = () => {
  const {isAuthenticated, login} = useContext(EvaluationContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onChangeShowPassword = () => {
    setShowPassword(previousState => !previousState)
  }

  const onSubmitLogin = async event => {
  event.preventDefault()

  setIsSubmitting(true)
  setShowSubmitError(false)

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        password,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      login(data.user)
      navigate('/', {replace: true})
    } else {
      setShowSubmitError(true)
      setErrorMsg(
        data.error_msg || "Username and Password didn't match",
      )
    }
  } catch (error) {
    console.error('LOGIN ERROR:', error)
    setShowSubmitError(true)
    setErrorMsg('Something went wrong. Please try again.')
  } finally {
    setIsSubmitting(false)
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

        <form className="form-container" onSubmit={onSubmitLogin}>
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
              placeholder="Username"
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
              placeholder="Password"
            />
          </div>

          <div className="checkbox-container">
            <input
              id="showPasswordCheckbox"
              type="checkbox"
              className="checkbox-input"
              checked={showPassword}
              onChange={onChangeShowPassword}
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
  disabled={isSubmitting}
>
  {isSubmitting ? 'Logging in...' : 'Login'}
</button>

<div className="register-container">
  <p>
    Don't have an account?{' '}
    <button
      type="button"
      className="register-button"
      onClick={() => navigate('/register')}
    >
      Register
    </button>
  </p>
</div>

{showSubmitError && (
  <p className="error-message">*{errorMsg}</p>
)}

          {showSubmitError && (
            <p className="error-message">*{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login