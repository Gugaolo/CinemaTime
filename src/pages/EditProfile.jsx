import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'

function EditProfile() {
  const { currentUser, updateProfile } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState(() => ({
    username: currentUser?.username ?? '',
    email: currentUser?.email ?? '',
    password: '',
  }))
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

    const result = await updateProfile(form)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/profile')
  }

  return (
    <div className="page center-page">
      <div className="form-box">
        <div className="panel-head">
          <div>
            <h2>Edit profile</h2>
            <p className="muted">Update your username, email, or password.</p>
          </div>
          <Link to="/profile" className="small-btn light-btn">Back</Link>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </label>

          <label>
            E-mail
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-mail"
            />
          </label>

          <label>
            New password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </label>

          <button type="submit" className="primary-btn">Save changes</button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  )
}

export default EditProfile
