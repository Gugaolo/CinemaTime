import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function SubmitSuggestion() {
  const { submitSuggestion } = useApp()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    genre: '',
    year: '',
    picture_url: '',
    description: '',
  })

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
    const result = await submitSuggestion(form)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/profile')
  }

  return (
    <div className="page center-page">
      <div className="form-box">
        <h2>Add a movie suggestion!</h2>

        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Name:
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Genre:
            <input name="genre" value={form.genre} onChange={handleChange} required />
          </label>

          <label>
            Year:
            <input name="year" value={form.year} onChange={handleChange} required />
          </label>

          <label>
            Picture:
            <input name="picture_url" value={form.picture_url} onChange={handleChange} required />
          </label>

          <label>
            Description:
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </label>

          <button type="submit" className="primary-btn">Add</button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  )
}

export default SubmitSuggestion
