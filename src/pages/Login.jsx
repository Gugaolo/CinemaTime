import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'

function Login() {
  const { login } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({
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
    const result = await login(form.email, form.password)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Log in</h2>

        <form onSubmit={handleSubmit} className="form-stack">
          <input
            name="email"
            type="email"
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
          <button type="submit" className="primary-btn">Log in</button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="small-text">
          Don&apos;t have an account yet? <Link to="/sign-up">Sign up.</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
