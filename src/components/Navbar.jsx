import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/App.css'

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('token')
    
    // Force a full page reload to reset application state and reroute correctly
    window.location.href = '/'
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="logo">SlotSwapper</h2>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/requests">Requests</Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}