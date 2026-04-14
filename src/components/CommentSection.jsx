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

  const comments = getMovieComments(movieId)

  function handleSubmit(event) {
    event.preventDefault()
    addComment(movieId, text)
    setText('')
  }

  function handleEditStart(comment) {
    setEditingCommentId(comment.id)
    setEditingText(comment.text)
  }

  function handleEditCancel() {
    setEditingCommentId(null)
    setEditingText('')
  }

  function handleEditSubmit(event, commentId) {
    event.preventDefault()
    updateComment(commentId, editingText)
    handleEditCancel()
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
                  onClick={() => deleteComment(comment.id)}
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
