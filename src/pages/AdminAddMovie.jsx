import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import MovieForm from '../components/MovieForm'
import { useApp } from '../context/AppContext'

function AdminAddMovie() {
  const { addMovie, prefillMovie } = useApp()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(formData) {
    setError('')
    setWarning('')
    setSuccess('')
    const result = await addMovie(formData)

    if (!result.success) {
      setError(result.message)
      return
    }

    if (result.warning) {
      setWarning(result.warning)
    }

    setSuccess('Movie added successfully.')
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
        {success && <p className="success-text">{success}</p>}
        {warning && <p className="muted">{warning}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  )
}

export default AdminAddMovie
