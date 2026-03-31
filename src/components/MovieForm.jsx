import { useState } from 'react'

const defaultForm = {
  title: '',
  genre: '',
  year: '',
  image_url: '',
  description: '',
  cast: '',
  suggestionId: null,
}

function MovieForm({ initialValues = defaultForm, onSubmit, buttonText = 'Save' }) {
  const [form, setForm] = useState({
    ...defaultForm,
    ...initialValues,
  })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="movie-form">
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
        Picture URL:
        <input name="image_url" value={form.image_url} onChange={handleChange} required />
      </label>

      <label>
        Description:
        <textarea name="description" value={form.description} onChange={handleChange} required />
      </label>

      <label>
        Cast:
        <input name="cast" value={form.cast} onChange={handleChange} />
      </label>

      <button type="submit" className="primary-btn">{buttonText}</button>
    </form>
  )
}

export default MovieForm