export const demoUsers = [
  {
    id: 1,
    username: 'nina',
    email: 'nina@gmail.com',
    password: 'nina123',
    role: 'user',
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
  },
]

export const demoMovies = [
  {
    id: 1,
    title: 'Dune: Part Two',
    year: 2024,
    genre: 'Sci-Fi',
    description: 'Epic science fiction film set on Arrakis.',
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    cast: 'Timothée Chalamet, Zendaya',
  },
  {
    id: 2,
    title: 'Oppenheimer',
    year: 2023,
    genre: 'Drama',
    description: 'A film about the creation of the atomic bomb.',
    image_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    cast: 'Cillian Murphy, Emily Blunt',
  },
  {
    id: 3,
    title: 'Interstellar',
    year: 2014,
    genre: 'Sci-Fi',
    description: 'A journey through space and time to save humanity.',
    image_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
    cast: 'Matthew McConaughey, Anne Hathaway',
  },
]

export const demoRatings = [
  { id: 1, movieId: 1, userId: 1, rating: 5 },
  { id: 2, movieId: 2, userId: 1, rating: 4 },
  { id: 3, movieId: 3, userId: 2, rating: 5 },
]

export const demoComments = [
  {
    id: 1,
    movieId: 1,
    userId: 1,
    username: 'nina',
    text: 'Really good movie.',
    createdAt: new Date().toISOString(),
  },
]

export const demoWatchlist = [
  { id: 1, userId: 1, movieId: 2 },
  { id: 2, userId: 1, movieId: 3 },
]

export const demoSuggestions = [
  {
    id: 1,
    title: 'The Hangover',
    genre: 'Comedy',
    year: 2009,
    picture_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=900&q=80',
    description: 'Comedy movie suggestion.',
    submittedBy: 'nina',
    status: 'pending',
  },
]