import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import RatingStars from './RatingStars'

function MovieCard({ movie, showEdit = false }) {
  const { getAverageRating } = useApp()
  const avg = getAverageRating(movie.id)

  return (
    <div className="movie-card">
      <img src={movie.image_url} alt={movie.title} className="movie-image" />

      <div className="movie-content">
        <h3>{movie.title}</h3>
        <p className="movie-small">{movie.genre} · {movie.year}</p>
        <p className="movie-description">{movie.description}</p>

        <RatingStars value={avg} readonly />
        <p className="movie-small">{avg ? avg.toFixed(1) : 'No ratings yet'}</p>

        <div className="card-actions">
          <Link to={`/movie/${movie.id}`} className="small-btn">View details</Link>
          {showEdit && (
            <Link to={`/admin/edit/${movie.id}`} className="small-btn light-btn">Edit</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard