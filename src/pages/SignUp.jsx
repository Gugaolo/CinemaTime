import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function SignUp() {
  const { signUp } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const result = await signUp(form)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/login')
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Sign up</h2>

        <form onSubmit={handleSubmit} className="form-stack">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit" className="primary-btn">Sign up</button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="small-text">
          Already have an account? <Link to="/login">Log in.</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
