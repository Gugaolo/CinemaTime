import { useMemo, useState } from 'react'
import { useApp } from '../context/useApp'
import MovieCard from '../components/MovieCard'
import { MOVIE_CATEGORIES } from '../data/movieCategories'

function Home() {
  const { movies, currentUser } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All categories')
  const featuredMovie = movies[0]

  const categories = useMemo(() => {
    const genreSet = new Set(MOVIE_CATEGORIES)

    movies.forEach((movie) => {
      movie.genre
        ?.split(',')
        .map((genre) => genre.trim())
        .filter(Boolean)
        .forEach((genre) => genreSet.add(genre))
    })

    return ['All categories', ...Array.from(genreSet).sort((a, b) => a.localeCompare(b))]
  }, [movies])

  const filteredMovies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return movies.filter((movie) => {
      const matchesSearch =
        !normalizedSearch ||
        [movie.title, movie.description, movie.genre, String(movie.year)]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch))

      const movieGenres = movie.genre
        ?.split(',')
        .map((genre) => genre.trim())
        .filter(Boolean) ?? []

      const matchesCategory =
        selectedCategory === 'All categories' || movieGenres.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [movies, searchTerm, selectedCategory])

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

      <section className="catalog-controls">
        <label className="catalog-search">
          <span>Search movies</span>
          <input
            type="search"
            placeholder="Search by title, description, genre, or year"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <label className="catalog-filter">
          <span>Category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </section>

      {filteredMovies.length ? (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              showEdit={currentUser?.role === 'admin'}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No movies match this search.</h3>
          <p>Try a different title or switch the category filter back to all categories.</p>
        </div>
      )}
    </div>
  )
}

export default Home
