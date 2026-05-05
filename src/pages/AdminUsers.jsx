import { useEffect, useEffectEvent, useState } from 'react'
import { useApp } from '../context/useApp'

function AdminUsers() {
  const { currentUser, profiles, fetchProfiles, adminUpdateProfile, adminDeleteProfile } = useApp()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ username: '', role: 'user' })
  const [busyId, setBusyId] = useState(null)

  const loadProfiles = useEffectEvent(async () => {
    setError('')
    setMessage('')
    const result = await fetchProfiles()

    if (!result.success) {
      setError(result.message)
    }
  })

  function startEditing(profile) {
    setError('')
    setMessage('')
    setEditingId(profile.id)
    setForm({
      username: profile.username ?? '',
      role: profile.role ?? 'user',
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setForm({ username: '', role: 'user' })
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSave(profileId) {
    setBusyId(profileId)
    setError('')
    setMessage('')

    const result = await adminUpdateProfile(profileId, form)

    setBusyId(null)

    if (!result.success) {
      setError(result.message)
      return
    }

    setMessage(result.message)
    cancelEditing()
  }

  async function handleDelete(profile) {
    const confirmDelete = window.confirm(
      `Delete ${profile.username || profile.email || 'this user'}? This removes their profile and app data.`,
    )

    if (!confirmDelete) {
      return
    }

    setBusyId(profile.id)
    setError('')
    setMessage('')

    const result = await adminDeleteProfile(profile.id)

    setBusyId(null)

    if (!result.success) {
      setError(result.message)
      return
    }

    if (editingId === profile.id) {
      cancelEditing()
    }

    setMessage(result.message)
  }

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
        {message && <p className="success-text">{message}</p>}

        {!error && profiles.length === 0 && (
          <p className="muted">No user profiles found.</p>
        )}

        {profiles.length > 0 && (
          <div className="accounts-table">
            <div className="accounts-table-head">
              <span>Username</span>
              <span>E-mail</span>
              <span>Role</span>
              <span>Actions</span>
            </div>

            {profiles.map((profile) => (
              <div key={profile.id} className="account-card">
                <div className="account-row">
                  <span>{profile.username || 'No username'}</span>
                  <span>{profile.email || 'No email'}</span>
                  <span className="account-role">{profile.role}</span>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => startEditing(profile)}
                      disabled={busyId === profile.id}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="secondary-btn danger-btn"
                      onClick={() => void handleDelete(profile)}
                      disabled={busyId === profile.id || profile.id === currentUser?.id}
                      title={profile.id === currentUser?.id ? 'You cannot delete your own profile.' : ''}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editingId === profile.id && (
                  <div className="account-editor">
                    <label>
                      Username
                      <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                      />
                    </label>

                    <label>
                      E-mail
                      <input value={profile.email || ''} disabled readOnly />
                    </label>

                    <label>
                      Role
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        disabled={profile.id === currentUser?.id}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>

                    <div className="row-actions">
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() => void handleSave(profile.id)}
                        disabled={busyId === profile.id}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={cancelEditing}
                        disabled={busyId === profile.id}
                      >
                        Cancel
                      </button>
                    </div>

                    <p className="muted admin-note">
                      E-mail is shown for reference here. Changing another user&apos;s auth e-mail or password requires a privileged backend path.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminUsers
