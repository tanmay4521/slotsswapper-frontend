import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Requests from './pages/Requests'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import './styles/App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const checkAuthStatus = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  return (
    <div className="app">
      {isAuthenticated && <Navbar />} 
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login onLoginSuccess={checkAuthStatus} />
          } 
        />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App