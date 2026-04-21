import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { useApp } from '../context/useApp'

function Profile() {
  const { currentUser, getUserWatchlistMovies, suggestions } = useApp()

  const watchlistMovies = getUserWatchlistMovies()
  const submittedCount = suggestions.filter(
    (item) => item.submittedById === currentUser?.id,
  ).length

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Your profile</h2>
            <p className="muted">Manage your account details and keep your watchlist in one place.</p>
          </div>
          <Link to="/profile/edit" className="small-btn">Edit profile</Link>
        </div>
        <p><strong>Username:</strong> {currentUser?.username}</p>
        <p><strong>Email:</strong> {currentUser?.email}</p>
        <p><strong>Role:</strong> {currentUser?.role}</p>
        <p><strong>Movies submitted:</strong> {submittedCount}</p>
        <p><strong>Movies watchlisted:</strong> {watchlistMovies.length}</p>
      </section>

      <section className="panel">
        <h2>Your watchlist</h2>

        <div className="movie-grid">
          {watchlistMovies.length === 0 && <p>No movies in watchlist yet.</p>}

          {watchlistMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Profile
