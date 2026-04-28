import { useState } from 'react'
import { getMovieCategoryOptions } from '../data/movieCategories'

const defaultForm = {
  title: '',
  genre: '',
  year: '',
  image_url: '',
  image_file: null,
  description: '',
  cast_members: '',
  suggestionId: null,
}

function MovieForm({ initialValues = defaultForm, onSubmit, buttonText = 'Save' }) {
  const [form, setForm] = useState({
    ...defaultForm,
    ...initialValues,
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const categoryOptions = getMovieCategoryOptions(form.genre)

  function handleChange(event) {
    const { name, value } = event.target
    setError('')
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null
    setError('')

    setForm((current) => ({
      ...current,
      image_file: file,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.image_url && !form.image_file) {
      setError('Add an image URL or upload an image file.')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(form)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <label>
        Name:
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <label>
        Genre:
        <select name="genre" value={form.genre} onChange={handleChange} required>
          <option value="" disabled>Select a category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Year:
        <input name="year" value={form.year} onChange={handleChange} required />
      </label>

      <label>
        Picture URL:
        <input name="image_url" value={form.image_url} onChange={handleChange} />
      </label>

      <label>
        Or upload picture:
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {form.image_file && <span className="movie-small">Selected file: {form.image_file.name}</span>}
      </label>

      <label>
        Description:
        <textarea name="description" value={form.description} onChange={handleChange} required />
      </label>

      <label>
        Cast:
        <input name="cast_members" value={form.cast_members} onChange={handleChange} />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="primary-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : buttonText}
      </button>
    </form>
  )
}

export default MovieForm
