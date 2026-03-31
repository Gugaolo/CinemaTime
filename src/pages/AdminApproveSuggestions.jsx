import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function AdminApproveSuggestions() {
  const { suggestions, rejectSuggestion, prepareSuggestionForMovie } = useApp()
  const navigate = useNavigate()

  const pendingSuggestions = suggestions.filter((item) => item.status === 'pending')

  function handleApprove(id) {
    prepareSuggestionForMovie(id)
    navigate('/admin/add-movie')
  }

  return (
    <div className="page">
      <section className="panel">
        <h2>Approve a movie</h2>

        {pendingSuggestions.length === 0 && <p>No pending suggestions.</p>}

        {pendingSuggestions.map((item) => (
          <div key={item.id} className="suggestion-row">
            <div>
              <p><strong>Name:</strong> {item.title}</p>
              <p><strong>Genre:</strong> {item.genre}</p>
              <p><strong>Year:</strong> {item.year}</p>
              <p><strong>Submitted by:</strong> {item.submittedBy}</p>
            </div>

            <div className="row-actions">
              <button className="small-btn" onClick={() => handleApprove(item.id)}>
                Approve
              </button>
              <button
                className="small-btn light-btn"
                onClick={() => rejectSuggestion(item.id)}
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default AdminApproveSuggestions