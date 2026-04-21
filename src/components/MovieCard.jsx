import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/useApp'
import RatingStars from './RatingStars'

function MovieCard({ movie, showEdit = false }) {
  const { getAverageRating, deleteMovie } = useApp()
  const avg = getAverageRating(movie.id)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${movie.title}"? This cannot be undone.`)
    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')
    const result = await deleteMovie(movie.id)

    if (!result.success) {
      setError(result.message)
      return
    }

    setSuccess(`"${movie.title}" was deleted.`)
  }

  return (
    <div className="movie-card">
      <img src={movie.image_url} alt={movie.title} className="movie-image" />

      <div className="movie-content">
        <h3>{movie.title}</h3>
        <p className="movie-small">{movie.genre} · {movie.year}</p>
        <p className="movie-description">{movie.description}</p>

        <div className="movie-card-footer">
          <RatingStars value={avg} readonly />
          <p className="movie-small">{avg ? avg.toFixed(1) : 'No ratings yet'}</p>
          {success && <p className="success-text">{success}</p>}
          {error && <p className="error-text">{error}</p>}

          <div className="card-actions">
            <Link to={`/movie/${movie.id}`} className="small-btn">View details</Link>
            {showEdit && (
              <>
                <Link to={`/admin/edit/${movie.id}`} className="small-btn light-btn">Edit</Link>
                <button type="button" className="secondary-btn" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
