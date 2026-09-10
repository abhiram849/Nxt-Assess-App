import React, {useContext} from 'react'
import {Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import EvaluationContext from '../../context/EvaluationContext.jsx'

const ProtectedRoute = ({children}) => {
  const {isAuthenticated} = useContext(EvaluationContext)
  const token = Cookies.get('jwt_token') || localStorage.getItem('jwt_token')

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
