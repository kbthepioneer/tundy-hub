import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching post:', error)
    } else {
      setPost(data)
    }
    setLoading(false)
  }

  // Upvote / Bet Counter logic
  const handleUpvote = async () => {
    const updatedUpvotes = (post.upvotes || 0) + 1

    const { error } = await supabase
      .from('posts')
      .update({ upvotes: updatedUpvotes })
      .eq('id', id)

    if (error) {
      console.error('Error updating upvotes:', error)
    } else {
      setPost({ ...post, upvotes: updatedUpvotes })
    }
  }

  // Delete Post logic
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post.')
    } else {
      navigate('/')
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading challenge details...</div>
  if (!post) return <div style={{ padding: '20px' }}>Post not found.</div>

  return (
    <div style={{ padding: '20px', maxWidth: '600px', textAlign: 'left' }}>
      <Link to="/">← Back to Feed</Link>
      <h2 style={{ marginTop: '15px' }}>{post.title}</h2>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Posted on: {new Date(post.created_at).toLocaleString()}
      </p>
      
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title} 
          style={{ maxWidth: '100%', borderRadius: '8px', margin: '15px 0' }} 
        />
      )}

      <p style={{ fontSize: '1.1em', lineHeight: '1.5' }}>{post.content}</p>

      <div style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button onClick={handleUpvote}>
          👍 {post.upvotes || 0} Upvotes / Bets
        </button>
        <Link to={`/edit/${post.id}`}>
          <button>Edit Post</button>
        </Link>
        <button onClick={handleDelete} style={{ backgroundColor: '#ff4d4d', color: 'white' }}>
          Delete Post
        </button>
      </div>
    </div>
  )
}