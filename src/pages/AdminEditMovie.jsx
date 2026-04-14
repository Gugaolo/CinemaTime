import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import MovieForm from '../components/MovieForm'
import { useApp } from '../context/AppContext'

function AdminEditMovie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { movies, updateMovie } = useApp()
  const [error, setError] = useState('')

  const movie = movies.find((item) => String(item.id) === id)

  if (!movie) {
    return <p>Movie not found.</p>
  }

  async function handleSubmit(formData) {
    setError('')
    const result = await updateMovie(movie.id, formData)

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
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  )
}

export default AdminEditMovie
