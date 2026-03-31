import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  demoComments,
  demoMovies,
  demoRatings,
  demoSuggestions,
  demoUsers,
  demoWatchlist,
} from '../data/demoData'

const AppContext = createContext()

const STORAGE_KEYS = {
  users: 'cinema_users',
  currentUser: 'cinema_current_user',
  movies: 'cinema_movies',
  ratings: 'cinema_ratings',
  comments: 'cinema_comments',
  watchlist: 'cinema_watchlist',
  suggestions: 'cinema_suggestions',
}

function readStorage(key, fallback) {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : fallback
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function AppProvider({ children }) {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [movies, setMovies] = useState([])
  const [ratings, setRatings] = useState([])
  const [comments, setComments] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [prefillMovie, setPrefillMovie] = useState(null)

  useEffect(() => {
    setUsers(readStorage(STORAGE_KEYS.users, demoUsers))
    setCurrentUser(readStorage(STORAGE_KEYS.currentUser, null))
    setMovies(readStorage(STORAGE_KEYS.movies, demoMovies))
    setRatings(readStorage(STORAGE_KEYS.ratings, demoRatings))
    setComments(readStorage(STORAGE_KEYS.comments, demoComments))
    setWatchlist(readStorage(STORAGE_KEYS.watchlist, demoWatchlist))
    setSuggestions(readStorage(STORAGE_KEYS.suggestions, demoSuggestions))
  }, [])

  useEffect(() => writeStorage(STORAGE_KEYS.users, users), [users])
  useEffect(() => writeStorage(STORAGE_KEYS.currentUser, currentUser), [currentUser])
  useEffect(() => writeStorage(STORAGE_KEYS.movies, movies), [movies])
  useEffect(() => writeStorage(STORAGE_KEYS.ratings, ratings), [ratings])
  useEffect(() => writeStorage(STORAGE_KEYS.comments, comments), [comments])
  useEffect(() => writeStorage(STORAGE_KEYS.watchlist, watchlist), [watchlist])
  useEffect(() => writeStorage(STORAGE_KEYS.suggestions, suggestions), [suggestions])

  function login(username, password) {
    const foundUser = users.find(
      (user) => user.username === username && user.password === password,
    )

    if (!foundUser) {
      return { success: false, message: 'Wrong username or password.' }
    }

    setCurrentUser(foundUser)
    return { success: true }
  }

  function signUp({ username, email, password }) {
    const usernameExists = users.some((user) => user.username === username)
    const emailExists = users.some((user) => user.email === email)

    if (usernameExists) {
      return { success: false, message: 'Username already exists.' }
    }

    if (emailExists) {
      return { success: false, message: 'Email already exists.' }
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      role: 'user',
    }

    setUsers((current) => [...current, newUser])
    setCurrentUser(newUser)

    return { success: true }
  }

  function logout() {
    setCurrentUser(null)
  }

  function getAverageRating(movieId) {
    const movieRatings = ratings.filter((item) => item.movieId === movieId)
    if (!movieRatings.length) return 0

    const total = movieRatings.reduce((sum, item) => sum + Number(item.rating), 0)
    return total / movieRatings.length
  }

  function getUserRating(movieId) {
    if (!currentUser) return 0
    const found = ratings.find(
      (item) => item.movieId === movieId && item.userId === currentUser.id,
    )
    return found ? found.rating : 0
  }

  function rateMovie(movieId, value) {
    if (!currentUser) return

    const existing = ratings.find(
      (item) => item.movieId === movieId && item.userId === currentUser.id,
    )

    if (existing) {
      setRatings((current) =>
        current.map((item) =>
          item.id === existing.id ? { ...item, rating: value } : item,
        ),
      )
      return
    }

    const newRating = {
      id: Date.now(),
      movieId,
      userId: currentUser.id,
      rating: value,
    }

    setRatings((current) => [...current, newRating])
  }

  function addComment(movieId, text) {
    if (!currentUser || !text.trim()) return

    const newComment = {
      id: Date.now(),
      movieId,
      userId: currentUser.id,
      username: currentUser.username,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }

    setComments((current) => [newComment, ...current])
  }

  function getMovieComments(movieId) {
    return comments.filter((comment) => comment.movieId === movieId)
  }

  function isInWatchlist(movieId) {
    if (!currentUser) return false
    return watchlist.some(
      (item) => item.userId === currentUser.id && item.movieId === movieId,
    )
  }

  function toggleWatchlist(movieId) {
    if (!currentUser) return

    const exists = watchlist.find(
      (item) => item.userId === currentUser.id && item.movieId === movieId,
    )

    if (exists) {
      setWatchlist((current) => current.filter((item) => item.id !== exists.id))
      return
    }

    const newWatchlistItem = {
      id: Date.now(),
      userId: currentUser.id,
      movieId,
    }

    setWatchlist((current) => [...current, newWatchlistItem])
  }

  function getUserWatchlistMovies() {
    if (!currentUser) return []
    const ids = watchlist
      .filter((item) => item.userId === currentUser.id)
      .map((item) => item.movieId)

    return movies.filter((movie) => ids.includes(movie.id))
  }

  function submitSuggestion(formData) {
    if (!currentUser) return

    const newSuggestion = {
      id: Date.now(),
      title: formData.title,
      genre: formData.genre,
      year: Number(formData.year),
      picture_url: formData.picture_url,
      description: formData.description,
      submittedBy: currentUser.username,
      status: 'pending',
    }

    setSuggestions((current) => [newSuggestion, ...current])
  }

  function rejectSuggestion(id) {
    setSuggestions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: 'rejected' } : item,
      ),
    )
  }

  function prepareSuggestionForMovie(id) {
    const suggestion = suggestions.find((item) => item.id === id)
    if (!suggestion) return

    setPrefillMovie({
      title: suggestion.title,
      genre: suggestion.genre,
      year: suggestion.year,
      image_url: suggestion.picture_url,
      description: suggestion.description,
      cast: '',
      suggestionId: suggestion.id,
    })
  }

  function addMovie(movieData) {
    const newMovie = {
      id: Date.now(),
      title: movieData.title,
      genre: movieData.genre,
      year: Number(movieData.year),
      image_url: movieData.image_url,
      description: movieData.description,
      cast: movieData.cast,
    }

    setMovies((current) => [...current, newMovie])

    if (movieData.suggestionId) {
      setSuggestions((current) =>
        current.map((item) =>
          item.id === movieData.suggestionId
            ? { ...item, status: 'approved' }
            : item,
        ),
      )
    }

    setPrefillMovie(null)
  }

  function updateMovie(movieId, movieData) {
    setMovies((current) =>
      current.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              title: movieData.title,
              genre: movieData.genre,
              year: Number(movieData.year),
              image_url: movieData.image_url,
              description: movieData.description,
              cast: movieData.cast,
            }
          : movie,
      ),
    )
  }

  const value = useMemo(
    () => ({
      users,
      currentUser,
      movies,
      ratings,
      comments,
      watchlist,
      suggestions,
      prefillMovie,
      login,
      signUp,
      logout,
      getAverageRating,
      getUserRating,
      rateMovie,
      addComment,
      getMovieComments,
      isInWatchlist,
      toggleWatchlist,
      getUserWatchlistMovies,
      submitSuggestion,
      rejectSuggestion,
      prepareSuggestionForMovie,
      addMovie,
      updateMovie,
    }),
    [users, currentUser, movies, ratings, comments, watchlist, suggestions, prefillMovie],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}