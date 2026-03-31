import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AppProvider } from './context/AppContext'
import AdminAddMovie from './pages/AdminAddMovie'
import AdminApproveSuggestions from './pages/AdminApproveSuggestions'
import AdminEditMovie from './pages/AdminEditMovie'
import Home from './pages/Home'
import Login from './pages/Login'
import MovieDetails from './pages/MovieDetails'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import SubmitSuggestion from './pages/SubmitSuggestion'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/submit-suggestion"
              element={
                <ProtectedRoute>
                  <SubmitSuggestion />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/approve"
              element={
                <ProtectedRoute adminOnly>
                  <AdminApproveSuggestions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/add-movie"
              element={
                <ProtectedRoute adminOnly>
                  <AdminAddMovie />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/edit/:id"
              element={
                <ProtectedRoute adminOnly>
                  <AdminEditMovie />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App