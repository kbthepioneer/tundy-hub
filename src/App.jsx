import { Routes, Route, Link } from 'react-router-dom'
// Import pages here once created
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import EditPost from './pages/EditPost'

function App() {
  return (
    <div className="app-container">
      <header className="navbar">
        <h1>Tundy Hub</h1>
        <nav>
          <Link to="/">Home Feed</Link>
          <Link to="/create">Create Challenge</Link>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </main>
    </div>
  )
}

export default App