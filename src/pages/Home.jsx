import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at') // 'created_at' or 'upvotes'

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order(sortBy, { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data)
    }
    setLoading(false)
  }

  // Filter posts based on search input (title search as required by rubric)
  const filteredPosts = posts.filter((post) => {
    return post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Home Feed</h2>

      {/* --- SEARCH & SORT CONTROLS --- */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '20px', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '250px', padding: '10px 14px' }}
        />

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>Sort By:</label>
          <button 
            onClick={() => setSortBy('created_at')}
            style={{ 
              fontWeight: sortBy === 'created_at' ? 'bold' : 'normal',
              backgroundColor: sortBy === 'created_at' ? '#38bdf8' : '#334155',
              color: 'white'
            }}
          >
            Newest
          </button>
          <button 
            onClick={() => setSortBy('upvotes')}
            style={{ 
              fontWeight: sortBy === 'upvotes' ? 'bold' : 'normal',
              backgroundColor: sortBy === 'upvotes' ? '#38bdf8' : '#334155',
              color: 'white'
            }}
          >
            Most Popular
          </button>
        </div>
      </div>

      {/* --- FEED DISPLAY --- */}
      {loading ? (
        <div style={{ padding: '20px' }}>Loading posts...</div>
      ) : filteredPosts.length === 0 ? (
        <p style={{ color: '#94a3b8', marginTop: '20px' }}>No posts match your search.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              style={{ 
                border: '1px solid var(--card-border, #334155)', 
                backgroundColor: 'var(--card-bg, #1e293b)',
                borderRadius: '12px', 
                padding: '20px', 
                textAlign: 'left' 
              }}
            >
              <p style={{ fontSize: '0.85em', color: '#94a3b8', margin: '0 0 8px 0' }}>
                Posted {new Date(post.created_at).toLocaleString()}
              </p>
              
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem' }}>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h3>

              <div style={{ marginTop: '10px', display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.95em' }}>
                <span>👍 {post.upvotes || 0} Upvotes</span>
                <span>💬 {post.comments ? post.comments.length : 0} Comments</span>
                <Link to={`/post/${post.id}`}>View Post →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}