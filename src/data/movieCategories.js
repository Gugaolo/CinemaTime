export const MOVIE_CATEGORIES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
]

export function getMovieCategoryOptions(currentValue = '') {
  const normalizedValue = currentValue.trim()

  if (!normalizedValue || MOVIE_CATEGORIES.includes(normalizedValue)) {
    return MOVIE_CATEGORIES
  }

  return [...MOVIE_CATEGORIES, normalizedValue].sort((a, b) => a.localeCompare(b))
}
