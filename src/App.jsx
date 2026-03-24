import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

const demoMovies = [
  {
    id: 1,
    title: 'Dune: Part Two',
    year: 2024,
    genre: 'Znanstvena fantastika',
    duration: '166 min',
    description:
      'Paul Atreides sprejme svojo vlogo med puščavskimi bojevniki in se poda v vojno proti silam, ki uničujejo Arrakis.',
    image_url:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    status: 'V kinu',
  },
  {
    id: 2,
    title: 'Oppenheimer',
    year: 2023,
    genre: 'Drama',
    duration: '180 min',
    description:
      'Portret fizičarja, ki vodi razvoj atomske bombe, in posledic odločitev, ki spremenijo svet.',
    image_url:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    status: 'Priporoceno',
  },
  {
    id: 3,
    title: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    genre: 'Animacija',
    duration: '140 min',
    description:
      'Miles Morales odpre vrata v multiverzum, kjer spozna novo ekipo Spider-junakov in mora poiskati svojo pot.',
    image_url:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
    status: 'Top izbor',
  },
]

const demoRatings = [
  { id: 1, movie_id: 1, user_name: 'Maja', rating: 5, comment: 'Vizualno noro dobro.' },
  { id: 2, movie_id: 2, user_name: 'Luka', rating: 4, comment: 'Napeto in zelo dobro odigrano.' },
]

const demoSuggestions = [
  {
    id: 1,
    title: 'Interstellar',
    description: 'Dodajte se ta film zaradi mocne zgodbe in glasbe.',
    user_name: 'Eva',
    status: 'V pregledu',
  },
]

const emptyMovieForm = {
  title: '',
  year: '',
  genre: '',
  duration: '',
  description: '',
  image_url: '',
  status: '',
}

const emptySuggestionForm = {
  title: '',
  description: '',
}

function averageRating(movieId, ratings) {
  const movieRatings = ratings.filter((item) => item.movie_id === movieId)
  if (!movieRatings.length) {
    return 'Brez ocen'
  }

  const avg = movieRatings.reduce((sum, item) => sum + Number(item.rating), 0) / movieRatings.length
  return `${avg.toFixed(1)} / 5`
}

function App() {
  const [profile, setProfile] = useState({ name: 'Nina', role: 'user' })
  const [draftProfile, setDraftProfile] = useState({ name: 'Nina', role: 'user' })
  const [movies, setMovies] = useState(demoMovies)
  const [ratings, setRatings] = useState(demoRatings)
  const [suggestions, setSuggestions] = useState(demoSuggestions)
  const [selectedMovieId, setSelectedMovieId] = useState(demoMovies[0].id)
  const [movieForm, setMovieForm] = useState(emptyMovieForm)
  const [editingMovieId, setEditingMovieId] = useState(null)
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: '' })
  const [suggestionForm, setSuggestionForm] = useState(emptySuggestionForm)
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')

  const selectedMovie = useMemo(
    () => movies.find((movie) => movie.id === selectedMovieId) ?? movies[0] ?? null,
    [movies, selectedMovieId],
  )

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setStatusMessage('Supabase ni nastavljen. Prikazan je demo nacin.')
        setLoading(false)
        return
      }

      setLoading(true)

      const [moviesRes, ratingsRes, suggestionsRes] = await Promise.all([
        supabase.from('movies').select('*').order('id'),
        supabase.from('ratings').select('*').order('id', { ascending: false }),
        supabase.from('suggestions').select('*').order('id', { ascending: false }),
      ])

      if (moviesRes.error || ratingsRes.error || suggestionsRes.error) {
        setStatusMessage('Napaka pri povezavi na Supabase. Prikazan je demo nacin.')
        setMovies(demoMovies)
        setRatings(demoRatings)
        setSuggestions(demoSuggestions)
      } else {
        const loadedMovies = moviesRes.data?.length ? moviesRes.data : demoMovies
        setMovies(loadedMovies)
        setRatings(ratingsRes.data ?? [])
        setSuggestions(suggestionsRes.data ?? [])
        setSelectedMovieId(loadedMovies[0]?.id ?? null)
        setStatusMessage('Podatki so nalozeni iz Supabase.')
      }

      setLoading(false)
    }

    loadData()
  }, [])

  function resetMovieForm() {
    setMovieForm(emptyMovieForm)
    setEditingMovieId(null)
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setProfile({
      name: draftProfile.name.trim() || 'Gost',
      role: draftProfile.role,
    })
  }

  async function handleRatingSubmit(event) {
    event.preventDefault()
    if (!selectedMovie) {
      return
    }

    const newRating = {
      movie_id: selectedMovie.id,
      user_name: profile.name,
      rating: Number(ratingForm.rating),
      comment: ratingForm.comment.trim(),
    }

    if (supabase) {
      const { data, error } = await supabase.from('ratings').insert(newRating).select().single()
      if (error) {
        setStatusMessage('Ocena ni bila shranjena v Supabase.')
        return
      }

      setRatings((current) => [data, ...current])
      setStatusMessage('Ocena je bila shranjena.')
    } else {
      setRatings((current) => [{ id: Date.now(), ...newRating }, ...current])
      setStatusMessage('Ocena je bila dodana v demo nacinu.')
    }

    setRatingForm({ rating: 5, comment: '' })
  }

  async function handleSuggestionSubmit(event) {
    event.preventDefault()

    const payload = {
      title: suggestionForm.title.trim(),
      description: suggestionForm.description.trim(),
      user_name: profile.name,
      status: 'V pregledu',
    }

    if (!payload.title || !payload.description) {
      setStatusMessage('Predlog mora imeti naslov in opis.')
      return
    }

    if (supabase) {
      const { data, error } = await supabase.from('suggestions').insert(payload).select().single()
      if (error) {
        setStatusMessage('Predloga ni bilo mogoce shraniti.')
        return
      }

      setSuggestions((current) => [data, ...current])
      setStatusMessage('Predlog je bil poslan adminu.')
    } else {
      setSuggestions((current) => [{ id: Date.now(), ...payload }, ...current])
      setStatusMessage('Predlog je dodan v demo nacinu.')
    }

    setSuggestionForm(emptySuggestionForm)
  }

  async function handleMovieSubmit(event) {
    event.preventDefault()

    const payload = {
      title: movieForm.title.trim(),
      year: Number(movieForm.year),
      genre: movieForm.genre.trim(),
      duration: movieForm.duration.trim(),
      description: movieForm.description.trim(),
      image_url: movieForm.image_url.trim(),
      status: movieForm.status.trim(),
    }

    if (
      !payload.title ||
      !payload.year ||
      !payload.genre ||
      !payload.duration ||
      !payload.description ||
      !payload.status
    ) {
      setStatusMessage('Film mora imeti izpolnjena glavna polja.')
      return
    }

    if (supabase) {
      if (editingMovieId) {
        const { data, error } = await supabase
          .from('movies')
          .update(payload)
          .eq('id', editingMovieId)
          .select()
          .single()

        if (error) {
          setStatusMessage('Urejanje filma ni uspelo.')
          return
        }

        setMovies((current) => current.map((movie) => (movie.id === editingMovieId ? data : movie)))
        setStatusMessage('Film je bil posodobljen.')
      } else {
        const { data, error } = await supabase.from('movies').insert(payload).select().single()
        if (error) {
          setStatusMessage('Dodajanje filma ni uspelo.')
          return
        }

        setMovies((current) => [...current, data])
        setSelectedMovieId(data.id)
        setStatusMessage('Film je bil dodan.')
      }
    } else {
      const localMovie = { id: editingMovieId ?? Date.now(), ...payload }
      if (editingMovieId) {
        setMovies((current) => current.map((movie) => (movie.id === editingMovieId ? localMovie : movie)))
        setStatusMessage('Film je bil posodobljen v demo nacinu.')
      } else {
        setMovies((current) => [...current, localMovie])
        setSelectedMovieId(localMovie.id)
        setStatusMessage('Film je bil dodan v demo nacinu.')
      }
    }

    resetMovieForm()
  }

  function startEditMovie(movie) {
    setEditingMovieId(movie.id)
    setMovieForm({
      title: movie.title ?? '',
      year: movie.year ?? '',
      genre: movie.genre ?? '',
      duration: movie.duration ?? '',
      description: movie.description ?? '',
      image_url: movie.image_url ?? '',
      status: movie.status ?? '',
    })
  }

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">CinemaTime</span>
          <h1>Preprosta filmska platforma za uporabnike in admina.</h1>
          <p>
            Uporabnik lahko bere opise filmov, jih ocenjuje in predlaga nove naslove. Admin pa lahko
            poleg tega filme tudi dodaja in ureja.
          </p>
        </div>

        <div className="hero-card">
          <div className="hero-stat">
            <strong>{movies.length}</strong>
            <span>filmov v zbirki</span>
          </div>
          <div className="hero-stat">
            <strong>{ratings.length}</strong>
            <span>uporabniskih ocen</span>
          </div>
          <div className="hero-stat">
            <strong>{suggestions.length}</strong>
            <span>predlogov skupnosti</span>
          </div>
        </div>
      </section>

      <main className="dashboard-grid">
        <aside className="sidebar card">
          <h2>Profil</h2>
          <form className="stack" onSubmit={handleProfileSubmit}>
            <label>
              Ime
              <input
                value={draftProfile.name}
                onChange={(event) => setDraftProfile((current) => ({ ...current, name: event.target.value }))}
                placeholder="Vnesi ime"
              />
            </label>

            <label>
              Vloga
              <select
                value={draftProfile.role}
                onChange={(event) => setDraftProfile((current) => ({ ...current, role: event.target.value }))}
              >
                <option value="user">Uporabnik</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <button type="submit">Shrani profil</button>
          </form>

          <div className="profile-badge">
            <span>{profile.name}</span>
            <strong>{profile.role === 'admin' ? 'Admin nacin' : 'Uporabniski nacin'}</strong>
          </div>

          <p className="status">{loading ? 'Nalagam podatke ...' : statusMessage}</p>

          <div className="supabase-note">
            <h3>Supabase</h3>
            <p>
              Nastavi `VITE_SUPABASE_URL` in `VITE_SUPABASE_ANON_KEY`, da se demo podatki zamenjajo z
              bazo.
            </p>
          </div>
        </aside>

        <section className="content-column">
          <div className="card movie-browser">
            <div className="section-title">
              <h2>Filmi</h2>
              <span>Klikni kartico za podrobnosti</span>
            </div>

            <div className="movie-list">
              {movies.map((movie) => (
                <button
                  key={movie.id}
                  type="button"
                  className={`movie-tile ${selectedMovie?.id === movie.id ? 'active' : ''}`}
                  onClick={() => setSelectedMovieId(movie.id)}
                >
                  <img src={movie.image_url} alt={movie.title} />
                  <div>
                    <strong>{movie.title}</strong>
                    <span>
                      {movie.genre} . {movie.year}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {selectedMovie && (
              <article className="featured-movie">
                <img src={selectedMovie.image_url} alt={selectedMovie.title} />

                <div className="featured-copy">
                  <div className="movie-meta">
                    <span>{selectedMovie.status}</span>
                    <span>Povprecje: {averageRating(selectedMovie.id, ratings)}</span>
                  </div>

                  <h3>
                    {selectedMovie.title} <small>({selectedMovie.year})</small>
                  </h3>
                  <p>{selectedMovie.description}</p>

                  <div className="tag-row">
                    <span>{selectedMovie.genre}</span>
                    <span>{selectedMovie.duration}</span>
                  </div>

                  {profile.role === 'admin' && (
                    <button type="button" className="secondary-button" onClick={() => startEditMovie(selectedMovie)}>
                      Uredi film
                    </button>
                  )}
                </div>
              </article>
            )}
          </div>

          <div className="split-grid">
            <section className="card">
              <div className="section-title">
                <h2>Oceni film</h2>
                <span>Za trenutno izbran film</span>
              </div>

              <form className="stack" onSubmit={handleRatingSubmit}>
                <label>
                  Ocena
                  <select
                    value={ratingForm.rating}
                    onChange={(event) => setRatingForm((current) => ({ ...current, rating: event.target.value }))}
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} / 5
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Komentar
                  <textarea
                    value={ratingForm.comment}
                    onChange={(event) => setRatingForm((current) => ({ ...current, comment: event.target.value }))}
                    placeholder="Kaj ti je bilo vsec?"
                  />
                </label>

                <button type="submit">Shrani oceno</button>
              </form>

              <div className="review-list">
                {ratings
                  .filter((item) => item.movie_id === selectedMovie?.id)
                  .slice(0, 4)
                  .map((item) => (
                    <article key={item.id} className="review-item">
                      <strong>
                        {item.user_name} . {item.rating}/5
                      </strong>
                      <p>{item.comment}</p>
                    </article>
                  ))}
              </div>
            </section>

            <section className="card">
              <div className="section-title">
                <h2>Predlagaj film</h2>
                <span>Uporabniki lahko posljejo ideje</span>
              </div>

              <form className="stack" onSubmit={handleSuggestionSubmit}>
                <label>
                  Naslov
                  <input
                    value={suggestionForm.title}
                    onChange={(event) =>
                      setSuggestionForm((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Naslov filma"
                  />
                </label>

                <label>
                  Opis
                  <textarea
                    value={suggestionForm.description}
                    onChange={(event) =>
                      setSuggestionForm((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder="Zakaj ga predlagas?"
                  />
                </label>

                <button type="submit">Poslji predlog</button>
              </form>

              <div className="suggestion-list">
                {suggestions.slice(0, 4).map((item) => (
                  <article key={item.id} className="suggestion-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                    <span>{item.status}</span>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        {profile.role === 'admin' && (
          <aside className="sidebar card">
            <div className="section-title">
              <h2>{editingMovieId ? 'Uredi film' : 'Dodaj film'}</h2>
              <span>Admin orodja</span>
            </div>

            <form className="stack" onSubmit={handleMovieSubmit}>
              <label>
                Naslov
                <input
                  value={movieForm.title}
                  onChange={(event) => setMovieForm((current) => ({ ...current, title: event.target.value }))}
                />
              </label>

              <label>
                Leto
                <input
                  type="number"
                  value={movieForm.year}
                  onChange={(event) => setMovieForm((current) => ({ ...current, year: event.target.value }))}
                />
              </label>

              <label>
                Zanr
                <input
                  value={movieForm.genre}
                  onChange={(event) => setMovieForm((current) => ({ ...current, genre: event.target.value }))}
                />
              </label>

              <label>
                Trajanje
                <input
                  value={movieForm.duration}
                  onChange={(event) => setMovieForm((current) => ({ ...current, duration: event.target.value }))}
                />
              </label>

              <label>
                Status
                <input
                  value={movieForm.status}
                  onChange={(event) => setMovieForm((current) => ({ ...current, status: event.target.value }))}
                  placeholder="V kinu / Novo / Top izbor"
                />
              </label>

              <label>
                URL slike
                <input
                  value={movieForm.image_url}
                  onChange={(event) => setMovieForm((current) => ({ ...current, image_url: event.target.value }))}
                  placeholder="https://..."
                />
              </label>

              <label>
                Opis
                <textarea
                  value={movieForm.description}
                  onChange={(event) =>
                    setMovieForm((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </label>

              <button type="submit">{editingMovieId ? 'Shrani spremembe' : 'Dodaj film'}</button>
              {editingMovieId && (
                <button type="button" className="secondary-button" onClick={resetMovieForm}>
                  Preklici urejanje
                </button>
              )}
            </form>
          </aside>
        )}
      </main>
    </div>
  )
}

export default App
