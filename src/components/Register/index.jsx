import React, {useContext, useState} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import EvaluationContext from '../../context/EvaluationContext'
import './index.css'

const Register = () => {
  const {isAuthenticated, login} = useContext(EvaluationContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmitRegister = async event => {
    event.preventDefault()

    setErrorMsg('')

    if (!username || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username,
            password,
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        login(data.user)
        navigate('/', {replace: true})
      } else {
        setErrorMsg(
          data.error_msg || 'Registration failed. Please try again.',
        )
      }
    } catch (error) {
      console.error('REGISTER ERROR:', error)
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
            alt="Nxt Assess logo"
          />
        </div>

        <form className="form-container" onSubmit={onSubmitRegister}>
          <div className="input-container">
            <label className="input-label" htmlFor="register-username">
              USERNAME
            </label>

            <input
              type="text"
              id="register-username"
              className="username-input-field"
              value={username}
              onChange={event => setUsername(event.target.value)}
              placeholder="Username"
            />
          </div>

          <div className="input-container">
            <label className="input-label" htmlFor="register-password">
              PASSWORD
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              id="register-password"
              className="password-input-field"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Password"
            />
          </div>

          <div className="checkbox-container">
            <input
              id="show-register-password"
              type="checkbox"
              className="checkbox-input"
              checked={showPassword}
              onChange={() =>
                setShowPassword(previousState => !previousState)
              }
            />

            <label
              htmlFor="show-register-password"
              className="checkbox-label"
            >
              Show Password
            </label>
          </div>

          <div className="input-container">
            <label
              className="input-label"
              htmlFor="register-confirm-password"
            >
              CONFIRM PASSWORD
            </label>

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="register-confirm-password"
              className="password-input-field"
              value={confirmPassword}
              onChange={event =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm Password"
            />
          </div>

          <div className="checkbox-container">
            <input
              id="show-confirm-password"
              type="checkbox"
              className="checkbox-input"
              checked={showConfirmPassword}
              onChange={() =>
                setShowConfirmPassword(previousState => !previousState)
              }
            />

            <label
              htmlFor="show-confirm-password"
              className="checkbox-label"
            >
              Show Confirm Password
            </label>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

          {errorMsg && (
            <p className="error-message">*{errorMsg}</p>
          )}

          <div className="register-container">
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="register-button"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register