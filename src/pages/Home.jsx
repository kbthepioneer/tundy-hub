import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    // Fetch all posts from Supabase ordered by newest first
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data)
    }
    setLoading(false)
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading posts...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>Home Feed</h2>
      {posts.length === 0 ? (
        <p>No posts found. Go create one!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {posts.map((post) => (
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
                <span>👍 {post.upvotes || 0} Upvotes</span>
                <Link to={`/post/${post.id}`}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}