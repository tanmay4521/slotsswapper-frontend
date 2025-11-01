import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import '../styles/App.css'

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/signup', form)
      alert('Signup successful! Please log in.')
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account</h2>
        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  )
}
