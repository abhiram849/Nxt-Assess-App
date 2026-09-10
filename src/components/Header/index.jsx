import React, {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import EvaluationContext from '../../context/EvaluationContext.jsx'
import './index.css'

const Header = () => {
  const {logout, isAuthenticated} = useContext(EvaluationContext)
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    logout()
    navigate('/login', {replace: true})
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/" className="nav-logo-link">
          <img
            src="/assets/nxt-assess-logo.svg"
            alt="website logo"
            className="website-logo"
          />
        </Link>

        {isAuthenticated && (
          <button
            type="button"
            className="logout-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header
