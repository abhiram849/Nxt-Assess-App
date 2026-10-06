import React, {useContext} from 'react'
import {Navigate} from 'react-router-dom'
import EvaluationContext from '../../context/EvaluationContext'

const ProtectedRoute = ({children}) => {
  const {isAuthenticated} = useContext(EvaluationContext)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute