import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
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
    } else if (data) {
      setTitle(data.title)
      setContent(data.content)
      setImageUrl(data.image_url || '')
    }
    setLoading(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('posts')
      .update({
        title: title,
        content: content,
        image_url: imageUrl || null,
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post.')
    } else {
      navigate(`/post/${id}`)
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading post editor...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '500px', textAlign: 'left' }}>
      <Link to={`/post/${id}`}>← Cancel</Link>
      <h2>Edit Challenge Post</h2>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          required
        />
        <input
          type="url"
          placeholder="Image URL (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  )
}