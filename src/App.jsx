import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {EvaluationProvider} from './context/EvaluationContext.jsx'
import Login from './components/Login/index.jsx'
import Home from './components/Home/index.jsx'
import Assessment from './components/Assessment/index.jsx'
import Results from './components/Results/index.jsx'
import NotFound from './components/NotFound/index.jsx'
import ProtectedRoute from './components/ProtectedRoute/index.jsx'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <EvaluationProvider>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment"
                element={
                  <ProtectedRoute>
                    <Assessment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </EvaluationProvider>
    </BrowserRouter>
  )
}

export default App
