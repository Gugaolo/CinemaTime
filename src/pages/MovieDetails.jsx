import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/useApp'
import RatingStars from '../components/RatingStars'
import CommentSection from '../components/CommentSection'

function MovieDetails() {
  const {
    movies,
    currentUser,
    getAverageRating,
    getUserRating,
    rateMovie,
    isInWatchlist,
    toggleWatchlist,
    deleteMovie,
  } = useApp()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const { id } = useParams()
  const movie = movies.find((item) => String(item.id) === id)

  if (!movie) {
    return <p>Movie not found.</p>
  }

  const avg = getAverageRating(movie.id)
  const myRating = getUserRating(movie.id)
  const inWatchlist = isInWatchlist(movie.id)

  async function handleWatchlistToggle() {
    setError('')
    setSuccess('')
    const result = await toggleWatchlist(movie.id)

    if (!result.success) {
      setError(result.message)
      return
    }

    setSuccess(inWatchlist ? 'Movie removed from watchlist.' : 'Movie added to watchlist.')
  }

  async function handleRate(value) {
    setError('')
    setSuccess('')
    const result = await rateMovie(movie.id, value)

    if (!result.success) {
      setError(result.message)
      return
    }

    setSuccess('Rating saved successfully.')
  }

  async function handleDeleteMovie() {
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
    navigate('/')
  }

  return (
    <div className="page">
      <div className="movie-details">
        <div className="movie-details-top">
          <img src={movie.image_url} alt={movie.title} className="details-image" />

          <div className="details-content">
            <h1>{movie.title}</h1>
            <p className="movie-small">Rating:</p>
            <RatingStars value={avg} readonly />
            <p>{avg ? avg.toFixed(1) : 'No ratings yet'}</p>

            <p className="details-text">{movie.description}</p>

            <div className="details-meta">
              <p><strong>Cast:</strong> {movie.cast_members || 'Unknown'}</p>
              <p><strong>Year:</strong> {movie.year}</p>
              <p><strong>Genre:</strong> {movie.genre}</p>
            </div>

            {success && <p className="success-text">{success}</p>}
            {error && <p className="error-text">{error}</p>}

            {currentUser && (
              <div className="details-actions">
                {currentUser.role === 'admin' && (
                  <div className="row-actions">
                    <Link to={`/admin/edit/${movie.id}`} className="small-btn light-btn">
                      Edit movie
                    </Link>
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={handleDeleteMovie}
                    >
                      Delete movie
                    </button>
                  </div>
                )}

                <button
                  className="primary-btn"
                  onClick={handleWatchlistToggle}
                >
                  {inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                </button>

                <div>
                  <p className="movie-small">Your rating:</p>
                  <RatingStars value={myRating} onRate={handleRate} />
                </div>
              </div>
            )}
          </div>
        </div>

        <CommentSection movieId={movie.id} />
      </div>
    </div>
  )
}

export default MovieDetails
