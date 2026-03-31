import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
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
  } = useApp()

  const { id } = useParams()
  const movie = movies.find((item) => String(item.id) === id)

  if (!movie) {
    return <p>Movie not found.</p>
  }

  const avg = getAverageRating(movie.id)
  const myRating = getUserRating(movie.id)
  const inWatchlist = isInWatchlist(movie.id)

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
              <p><strong>Cast:</strong> {movie.cast || 'Unknown'}</p>
              <p><strong>Year:</strong> {movie.year}</p>
              <p><strong>Genre:</strong> {movie.genre}</p>
            </div>

            {currentUser && (
              <div className="details-actions">
                <button
                  className="primary-btn"
                  onClick={() => toggleWatchlist(movie.id)}
                >
                  {inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                </button>

                <div>
                  <p className="movie-small">Your rating:</p>
                  <RatingStars value={myRating} onRate={(value) => rateMovie(movie.id, value)} />
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