function RatingStars({ value = 0, onRate, readonly = false }) {
  const rounded = Math.round(value)

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rounded ? 'star active' : 'star'}
          onClick={() => !readonly && onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default RatingStars