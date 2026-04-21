import { useEffect, useEffectEvent, useState } from 'react'
import { useApp } from '../context/useApp'

function AdminUsers() {
  const { profiles, fetchProfiles } = useApp()
  const [error, setError] = useState('')

  const loadProfiles = useEffectEvent(async () => {
    setError('')
    const result = await fetchProfiles()

    if (!result.success) {
      setError(result.message)
    }
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProfiles()
  }, [])

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>User accounts</h2>
            <p className="muted">Admin view of all profile records stored in Supabase.</p>
          </div>
          <span className="account-count">{profiles.length} accounts</span>
        </div>

        {error && <p className="error-text">{error}</p>}

        {!error && profiles.length === 0 && (
          <p className="muted">No user profiles found.</p>
        )}

        {profiles.length > 0 && (
          <div className="accounts-table">
            <div className="accounts-table-head">
              <span>Username</span>
              <span>E-mail</span>
              <span>Role</span>
            </div>

            {profiles.map((profile) => (
              <div key={profile.id} className="account-row">
                <span>{profile.username || 'No username'}</span>
                <span>{profile.email || 'No email'}</span>
                <span className="account-role">{profile.role}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminUsers
