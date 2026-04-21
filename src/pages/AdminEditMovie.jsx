import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import MovieForm from '../components/MovieForm'
import { useApp } from '../context/useApp'

function AdminEditMovie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { movies, updateMovie, isLoading } = useApp()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const movie = movies.find((item) => String(item.id) === id)

  if (isLoading) {
    return <p className="page">Loading movie...</p>
  }

  if (!movie) {
    return (
      <div className="page center-page">
        <div className="form-box">
          <h2>Edit details</h2>
          <p className="error-text">Movie not found.</p>
        </div>
      </div>
    )
  }

  async function handleSubmit(formData) {
  setError('')
  setSuccess('')

  const result = await updateMovie(movie.id, {
    ...formData,
    image_url: formData.image_url || movie.image_url || '',
  })

  if (!result.success) {
    setError(result.message)
    return
  }

  navigate(`/movie/${movie.id}`)
}

  return (
    <div className="page center-page">
      <div className="form-box">
        <h2>Edit details</h2>
        <MovieForm
          initialValues={movie}
          onSubmit={handleSubmit}
          buttonText="Edit"
        />
        {success && <p className="success-text">{success}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  )
}

export default AdminEditMovie
