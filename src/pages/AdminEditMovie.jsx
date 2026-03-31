import { useNavigate, useParams } from 'react-router-dom'
import MovieForm from '../components/MovieForm'
import { useApp } from '../context/AppContext'

function AdminEditMovie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { movies, updateMovie } = useApp()

  const movie = movies.find((item) => String(item.id) === id)

  if (!movie) {
    return <p>Movie not found.</p>
  }

  function handleSubmit(formData) {
    updateMovie(movie.id, formData)
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
      </div>
    </div>
  )
}

export default AdminEditMovie