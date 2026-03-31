import { useNavigate } from 'react-router-dom'
import MovieForm from '../components/MovieForm'
import { useApp } from '../context/AppContext'

function AdminAddMovie() {
  const { addMovie, prefillMovie } = useApp()
  const navigate = useNavigate()

  function handleSubmit(formData) {
    addMovie(formData)
    navigate('/')
  }

  return (
    <div className="page center-page">
      <div className="form-box">
        <h2>Add a movie</h2>
        <MovieForm
          initialValues={prefillMovie || undefined}
          onSubmit={handleSubmit}
          buttonText="Add"
        />
      </div>
    </div>
  )
}

export default AdminAddMovie