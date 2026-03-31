import { useState } from 'react'
import { useApp } from '../context/AppContext'

function CommentSection({ movieId }) {
  const { currentUser, getMovieComments, addComment } = useApp()
  const [text, setText] = useState('')

  const comments = getMovieComments(movieId)

  function handleSubmit(event) {
    event.preventDefault()
    addComment(movieId, text)
    setText('')
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
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CommentSection