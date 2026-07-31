import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')

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

  // Add Comment logic
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const currentComments = post.comments || []
    const updatedComments = [...currentComments, commentText.trim()]

    const { error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', id)

    if (error) {
      console.error('Error adding comment:', error)
      alert('Failed to post comment.')
    } else {
      setPost({ ...post, comments: updatedComments })
      setCommentText('')
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
    <div style={{ padding: '20px', maxWidth: '650px', textAlign: 'left', margin: '0 auto' }}>
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

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* --- COMMENTS SECTION --- */}
      <h3>Comments</h3>
      
      <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Leave a comment on this challenge..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ flex: 1, padding: '8px 12px' }}
        />
        <button type="submit">Post Comment</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {(!post.comments || post.comments.length === 0) ? (
          <p style={{ color: '#888', italic: 'true' }}>No comments yet. Be the first!</p>
        ) : (
          post.comments.map((comment, idx) => (
            <div 
              key={idx} 
              style={{ 
                padding: '10px 14px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '6px',
                borderLeft: '4px solid #007bff',
                color: '#222'
              }}
            >
              {comment}
            </div>
          ))
        )}
      </div>
    </div>
  )
}