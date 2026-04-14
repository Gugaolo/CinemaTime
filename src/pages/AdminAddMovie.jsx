import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import MovieForm from '../components/MovieForm'
import { useApp } from '../context/AppContext'

function AdminAddMovie() {
  const { addMovie, prefillMovie } = useApp()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleSubmit(formData) {
    setError('')
    const result = await addMovie(formData)

    if (!result.success) {
      setError(result.message)
      return
    }

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
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  )
}

export default AdminAddMovie
