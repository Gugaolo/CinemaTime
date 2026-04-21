import { useState } from 'react'
import { useApp } from '../context/useApp'

function CommentSection({ movieId }) {
  const {
    currentUser,
    getMovieComments,
    addComment,
    updateComment,
    deleteComment,
  } = useApp()
  const [text, setText] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [error, setError] = useState('')

  const comments = getMovieComments(movieId)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const result = await addComment(movieId, text)

    if (!result.success) {
      setError(result.message)
      return
    }

    setText('')
  }

  function handleEditStart(comment) {
    setEditingCommentId(comment.id)
    setEditingText(comment.text)
    setError('')
  }

  function handleEditCancel() {
    setEditingCommentId(null)
    setEditingText('')
  }

  async function handleEditSubmit(event, commentId) {
    event.preventDefault()
    setError('')
    const result = await updateComment(commentId, editingText)

    if (!result.success) {
      setError(result.message)
      return
    }

    handleEditCancel()
  }

  async function handleDelete(commentId) {
    setError('')
    const result = await deleteComment(commentId)

    if (!result.success) {
      setError(result.message)
    }
  }

  function canEditComment(comment) {
    if (!currentUser) {
      return false
    }

    return currentUser.role === 'admin' || currentUser.id === comment.userId
  }

  function canDeleteComment(comment) {
    if (!currentUser) {
      return false
    }

    return currentUser.id === comment.userId
  }

  return (
    <section className="panel">
      <h3>Comments</h3>

      {currentUser && (
        <form onSubmit={handleSubmit} className="form-stack">
          <textarea
            placeholder="Write a comment..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <button type="submit" className="primary-btn">Add comment</button>
        </form>
      )}

      {!currentUser && <p className="muted">Log in to write a comment.</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="comment-list">
        {comments.length === 0 && <p className="muted">No comments yet.</p>}

        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <strong>{comment.username}</strong>
            {editingCommentId === comment.id ? (
              <form onSubmit={(event) => handleEditSubmit(event, comment.id)} className="form-stack">
                <textarea
                  value={editingText}
                  onChange={(event) => setEditingText(event.target.value)}
                />
                <div className="row-actions">
                  <button type="submit" className="primary-btn">Save</button>
                  <button type="button" className="secondary-btn" onClick={handleEditCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p>{comment.text}</p>
            )}

            {canEditComment(comment) && editingCommentId !== comment.id && (
              <div className="row-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => handleEditStart(comment)}
                >
                  Edit
                </button>
                {canDeleteComment(comment) && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CommentSection
