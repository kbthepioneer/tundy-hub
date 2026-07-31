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

  // Filter posts based on search input (title or content)
  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const contentMatch = post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    return titleMatch || contentMatch
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
          placeholder="Search challenges by title or keyword..."
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
              backgroundColor: sortBy === 'created_at' ? '#007bff' : '#eee',
              color: sortBy === 'created_at' ? 'white' : 'black'
            }}
          >
            Newest
          </button>
          <button 
            onClick={() => setSortBy('upvotes')}
            style={{ 
              fontWeight: sortBy === 'upvotes' ? 'bold' : 'normal',
              backgroundColor: sortBy === 'upvotes' ? '#007bff' : '#eee',
              color: sortBy === 'upvotes' ? 'white' : 'black'
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
        <p style={{ color: '#666', marginTop: '20px' }}>No posts match your search.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              style={{ 
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                padding: '15px', 
                textAlign: 'left' 
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.image_url && (
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} 
                />
              )}
              <div style={{ marginTop: '10px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span>👍 {post.upvotes || 0} Upvotes / Bets</span>
                <span>💬 {post.comments ? post.comments.length : 0} Comments</span>
                <Link to={`/post/${post.id}`}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}