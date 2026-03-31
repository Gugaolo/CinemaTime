import { useApp } from '../context/AppContext'
import MovieCard from '../components/MovieCard'

function Home() {
  const { movies, currentUser } = useApp()

  return (
    <div className="page">
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