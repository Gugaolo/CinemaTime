import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext()

function normalizeMovie(movie) {
  return {
    ...movie,
    cast_members: movie.cast_members ?? '',
  }
}

function normalizeRating(rating) {
  return {
    id: rating.id,
    userId: rating.user_id,
    movieId: rating.movie_id,
    rating: rating.rating,
  }
}

function normalizeWatchlistItem(item) {
  return {
    id: item.id,
    userId: item.user_id,
    movieId: item.movie_id,
  }
}

async function fetchProfilesByIds(userIds) {
  if (!supabase || userIds.length === 0) {
    return {}
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, role')
    .in('id', userIds)

  if (error) {
    console.error('Failed to load profiles:', error)
    return {}
  }

  return data.reduce((result, profile) => {
    result[profile.id] = profile
    return result
  }, {})
}

async function fetchProfile(userId) {
  if (!supabase || !userId) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, role')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Failed to load current profile:', error)
    return null
  }

  return data
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [movies, setMovies] = useState([])
  const [ratings, setRatings] = useState([])
  const [comments, setComments] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [prefillMovie, setPrefillMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchMovies() {
    if (!supabase) {
      console.error('Supabase client is not configured.')
      return
    }

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load movies:', error)
      return
    }

    setMovies(data.map(normalizeMovie))
  }

  async function fetchRatings() {
    if (!supabase) {
      console.error('Supabase client is not configured.')
      return
    }

    const { data, error } = await supabase
      .from('ratings')
      .select('*')

    if (error) {
      console.error('Failed to load ratings:', error)
      return
    }

    setRatings(data.map(normalizeRating))
  }

  async function fetchComments() {
    if (!supabase) {
      console.error('Supabase client is not configured.')
      return
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load comments:', error)
      return
    }

    const profileMap = await fetchProfilesByIds(
      [...new Set(data.map((comment) => comment.user_id).filter(Boolean))],
    )

    setComments(
      data.map((comment) => ({
        id: comment.id,
        userId: comment.user_id,
        movieId: comment.movie_id,
        username: profileMap[comment.user_id]?.username ?? 'Unknown user',
        text: comment.content,
        createdAt: comment.created_at,
      })),
    )
  }

  async function fetchWatchlist(userId = currentUser?.id) {
    if (!supabase || !userId) {
      setWatchlist([])
      return
    }

    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to load watchlist:', error)
      return
    }

    setWatchlist(data.map(normalizeWatchlistItem))
  }

  async function fetchSuggestions() {
    if (!supabase || !currentUser) {
      setSuggestions([])
      return
    }

    const { data, error } = await supabase
      .from('movie_suggestions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load suggestions:', error)
      return
    }

    const profileMap = await fetchProfilesByIds(
      [...new Set(data.map((suggestion) => suggestion.submitted_by).filter(Boolean))],
    )

    setSuggestions(
      data.map((suggestion) => ({
        id: suggestion.id,
        title: suggestion.title,
        genre: suggestion.genre,
        year: suggestion.year,
        picture_url: suggestion.picture_url,
        description: suggestion.description,
        submittedById: suggestion.submitted_by,
        submittedBy: profileMap[suggestion.submitted_by]?.username ?? 'Unknown user',
        status: suggestion.status,
      })),
    )
  }

  async function refreshCurrentUser(authUser) {
    const profile = await fetchProfile(authUser.id)

    setCurrentUser({
      id: authUser.id,
      email: profile?.email ?? authUser.email ?? '',
      username: profile?.username ?? authUser.email ?? 'User',
      role: profile?.role ?? 'user',
    })
  }

  useEffect(() => {
    let ignore = false

    async function initializeApp() {
      if (!supabase) {
        console.error('Supabase client is not configured.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      await Promise.all([
        fetchMovies(),
        fetchRatings(),
        fetchComments(),
      ])

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Failed to read auth session:', error)
      } else if (!ignore && data.session?.user) {
        await refreshCurrentUser(data.session.user)
      }

      if (!ignore) {
        setIsLoading(false)
      }
    }

    void initializeApp()

    const { data } = supabase?.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await refreshCurrentUser(session.user)
      } else {
        setCurrentUser(null)
      }
    }) ?? { data: { subscription: null } }

    return () => {
      ignore = true
      data.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!currentUser) {
      setWatchlist([])
      setSuggestions([])
      setPrefillMovie(null)
      return
    }

    void fetchWatchlist(currentUser.id)
    void fetchSuggestions()
  }, [currentUser])

  async function login(email, password) {
    if (!supabase) {
      const message = 'Supabase is not configured.'
      console.error(message)
      return { success: false, message }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      console.error('Login failed:', error)
      return { success: false, message: error.message }
    }

    return { success: true }
  }

  async function signUp({ username, email, password }) {
    if (!supabase) {
      const message = 'Supabase is not configured.'
      console.error(message)
      return { success: false, message }
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
        },
      },
    })

    if (error) {
      console.error('Sign up failed:', error)
      return { success: false, message: error.message }
    }

    if (!data.user) {
      return {
        success: true,
        message: 'Check your email to confirm your account before logging in.',
      }
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      username: username.trim(),
      email: email.trim(),
      role: 'user',
    })

    if (profileError) {
      console.error('Failed to create profile:', profileError)
      return { success: false, message: profileError.message }
    }

    return {
      success: true,
      message: data.session
        ? ''
        : 'Check your email to confirm your account before logging in.',
    }
  }

  async function logout() {
    if (!supabase) {
      console.error('Supabase is not configured.')
      return
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout failed:', error)
    }
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

  async function rateMovie(movieId, value) {
    if (!supabase || !currentUser) {
      return { success: false, message: 'You must be logged in to rate a movie.' }
    }

    const { error } = await supabase.from('ratings').upsert(
      {
        user_id: currentUser.id,
        movie_id: movieId,
        rating: value,
      },
      {
        onConflict: 'user_id,movie_id',
      },
    )

    if (error) {
      console.error('Failed to save rating:', error)
      return { success: false, message: error.message }
    }

    await fetchRatings()
    return { success: true }
  }

  async function addComment(movieId, text) {
    if (!supabase || !currentUser || !text.trim()) {
      return { success: false, message: 'Comment text is required.' }
    }

    const { error } = await supabase.from('comments').insert({
      user_id: currentUser.id,
      movie_id: movieId,
      content: text.trim(),
    })

    if (error) {
      console.error('Failed to add comment:', error)
      return { success: false, message: error.message }
    }

    await fetchComments()
    return { success: true }
  }

  async function updateComment(commentId, text) {
    if (!supabase || !currentUser || !text.trim()) {
      return { success: false, message: 'Comment text is required.' }
    }

    const { error } = await supabase
      .from('comments')
      .update({ content: text.trim() })
      .eq('id', commentId)
      .eq('user_id', currentUser.id)

    if (error) {
      console.error('Failed to update comment:', error)
      return { success: false, message: error.message }
    }

    await fetchComments()
    return { success: true }
  }

  async function deleteComment(commentId) {
    if (!supabase || !currentUser) {
      return { success: false, message: 'You must be logged in to delete comments.' }
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', currentUser.id)

    if (error) {
      console.error('Failed to delete comment:', error)
      return { success: false, message: error.message }
    }

    await fetchComments()
    return { success: true }
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

  async function toggleWatchlist(movieId) {
    if (!supabase || !currentUser) {
      return { success: false, message: 'You must be logged in to manage watchlist.' }
    }

    const existing = watchlist.find(
      (item) => item.userId === currentUser.id && item.movieId === movieId,
    )

    let error = null

    if (existing) {
      const response = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('movie_id', movieId)

      error = response.error
    } else {
      const response = await supabase.from('watchlist').insert({
        user_id: currentUser.id,
        movie_id: movieId,
      })

      error = response.error
    }

    if (error) {
      console.error('Failed to update watchlist:', error)
      return { success: false, message: error.message }
    }

    await fetchWatchlist(currentUser.id)
    return { success: true }
  }

  function getUserWatchlistMovies() {
    if (!currentUser) return []

    const ids = watchlist
      .filter((item) => item.userId === currentUser.id)
      .map((item) => item.movieId)

    return movies.filter((movie) => ids.includes(movie.id))
  }

  async function submitSuggestion(formData) {
    if (!supabase || !currentUser) {
      return { success: false, message: 'You must be logged in to submit a suggestion.' }
    }

    const { error } = await supabase.from('movie_suggestions').insert({
      title: formData.title,
      genre: formData.genre,
      year: Number(formData.year),
      picture_url: formData.picture_url,
      description: formData.description,
      submitted_by: currentUser.id,
      status: 'pending',
    })

    if (error) {
      console.error('Failed to submit suggestion:', error)
      return { success: false, message: error.message }
    }

    await fetchSuggestions()
    return { success: true }
  }

  async function rejectSuggestion(id) {
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured.' }
    }

    const { error } = await supabase
      .from('movie_suggestions')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (error) {
      console.error('Failed to reject suggestion:', error)
      return { success: false, message: error.message }
    }

    await fetchSuggestions()
    return { success: true }
  }

  function prepareSuggestionForMovie(id) {
    const suggestion = suggestions.find((item) => item.id === id)
    if (!suggestion) return

    setPrefillMovie({
      title: suggestion.title,
      genre: suggestion.genre ?? '',
      year: suggestion.year ?? '',
      image_url: suggestion.picture_url ?? '',
      description: suggestion.description ?? '',
      cast_members: '',
      suggestionId: suggestion.id,
    })
  }

  async function addMovie(movieData) {
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured.' }
    }

    const { error } = await supabase.from('movies').insert({
      title: movieData.title,
      genre: movieData.genre,
      year: Number(movieData.year),
      image_url: movieData.image_url,
      description: movieData.description,
      cast_members: movieData.cast_members,
    })

    if (error) {
      console.error('Failed to add movie:', error)
      return { success: false, message: error.message }
    }

    if (movieData.suggestionId) {
      const { error: suggestionError } = await supabase
        .from('movie_suggestions')
        .update({ status: 'approved' })
        .eq('id', movieData.suggestionId)

      if (suggestionError) {
        console.error('Failed to approve suggestion:', suggestionError)
        return { success: false, message: suggestionError.message }
      }

      await fetchSuggestions()
    }

    await fetchMovies()
    setPrefillMovie(null)
    return { success: true }
  }

  async function updateMovie(movieId, movieData) {
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured.' }
    }

    const { error } = await supabase
      .from('movies')
      .update({
        title: movieData.title,
        genre: movieData.genre,
        year: Number(movieData.year),
        image_url: movieData.image_url,
        description: movieData.description,
        cast_members: movieData.cast_members,
      })
      .eq('id', movieId)

    if (error) {
      console.error('Failed to update movie:', error)
      return { success: false, message: error.message }
    }

    await fetchMovies()
    return { success: true }
  }

  const value = useMemo(
    () => ({
      currentUser,
      movies,
      ratings,
      comments,
      watchlist,
      suggestions,
      prefillMovie,
      isLoading,
      login,
      signUp,
      logout,
      fetchMovies,
      fetchComments,
      fetchRatings,
      fetchWatchlist,
      fetchSuggestions,
      getAverageRating,
      getUserRating,
      rateMovie,
      addComment,
      updateComment,
      deleteComment,
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
    [currentUser, movies, ratings, comments, watchlist, suggestions, prefillMovie, isLoading],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
