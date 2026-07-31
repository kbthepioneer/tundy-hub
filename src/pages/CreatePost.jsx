import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Insert new challenge post into Supabase matching your schema
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          title: title, 
          content: content, 
          image_url: imageUrl || null,
          upvotes: 0 
        }
      ])

    if (error) {
      console.error('Error inserting post:', error)
      alert('Error creating post: ' + error.message)
    } else {
      console.log('Post created successfully:', data)
      navigate('/') // Redirect to Home Feed
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post Content / Rules"
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
        <button type="submit">Create Post</button>
      </form>
    </div>
  )
}