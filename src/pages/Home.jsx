import { useApp } from '../context/AppContext'
import MovieCard from '../components/MovieCard'

function Home() {
  const { movies, currentUser } = useApp()
  const featuredMovie = movies[0]

  return (
    <div className="page home-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-kicker">Curated movie nights</span>
          <h1 className="hero-title">CinemaTime</h1>
          <p className="hero-description">
            Discover films, track your favorites, rate what you watch, and build a
            personal watchlist in one clean space.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{movies.length}</strong>
              <span>movies in the catalog</span>
            </div>
            <div className="hero-stat">
              <strong>{currentUser ? currentUser.role : 'Guest'}</strong>
              <span>account mode</span>
            </div>
            <div className="hero-stat">
              <strong>{featuredMovie?.year ?? 'Now'}</strong>
              <span>featured release year</span>
            </div>
          </div>
        </div>

        <aside className="hero-card">
          <span className="hero-card-label">Spotlight</span>
          <div>
            <h2 className="hero-card-title">{featuredMovie?.title ?? 'Your next movie night'}</h2>
            <p>
              {featuredMovie?.description ??
                'Pick a film, drop a rating, and keep your watchlist ready for the weekend.'}
            </p>
          </div>
          <p>{featuredMovie ? `${featuredMovie.genre} - ${featuredMovie.year}` : 'Fresh picks for every mood'}</p>
        </aside>
      </section>

      <div className="home-section-head">
        <div>
          <h2>Now Showing</h2>
          <p>Browse the current selection and open any movie for details, ratings, and comments.</p>
        </div>
      </div>

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            showEdit={currentUser?.role === 'admin'}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
