import { useState } from 'react'
import { useApp } from '../context/AppContext'

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

  if (!form.image_url && !form.image_file) {
    setError('Add an image URL or upload an image file.')
    return
  }

  setIsSubmitting(true)
  setError('')

  try {
    const result = await onSubmit(form)

    if (result && !result.success) {
      setError(result.message || 'Saving failed.')
    }
  } catch (error) {
    console.error(error)
    setError(error.message || 'Saving failed.')
  } finally {
    setIsSubmitting(false)
  }
}

  function handleEditStart(comment) {
    setEditingCommentId(comment.id)
    setEditingText(comment.text)
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

            {currentUser?.id === comment.userId && editingCommentId !== comment.id && (
              <div className="row-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => handleEditStart(comment)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CommentSection
