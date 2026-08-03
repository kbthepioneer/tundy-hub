import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
      setContent(data.content || '')
      setImageUrl(data.image_url || '')
      if (data.image_url) {
        setPreview(data.image_url)
      }
    }
    setLoading(false)
  }

  // Handle file drop/selection
  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)

    let finalImageUrl = imageUrl

    // Upload new file if provided
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        alert('Failed to upload image file. Please check Supabase storage policy.')
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)

      finalImageUrl = urlData.publicUrl
    }

    const { error } = await supabase
      .from('posts')
      .update({
        title: title,
        content: content,
        image_url: finalImageUrl || null,
      })
      .eq('id', id)

    setSaving(false)

    if (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post.')
    } else {
      navigate(`/post/${id}`)
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading post editor...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <Link to={`/post/${id}`}>← Cancel</Link>
      <h2 style={{ marginTop: '15px' }}>Edit Challenge Post</h2>
      
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* --- DRAG & DROP ZONE IN EDIT VIEW --- */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Update Image (Drag & Drop or Select File)
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? 'var(--primary-accent, #38bdf8)' : 'var(--card-border, #334155)'}`,
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.1)' : 'var(--card-bg, #1e293b)',
              cursor: 'pointer'
            }}
          >
            {preview ? (
              <div>
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ maxHeight: '180px', borderRadius: '8px', marginBottom: '10px' }} 
                />
                <div>
                  <button 
                    type="button" 
                    onClick={() => { setFile(null); setPreview(null); setImageUrl(''); }}
                    style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.8em', padding: '4px 10px' }}
                  >
                    Remove / Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 10px 0' }}>📁 Drag & drop a new photo here, or</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  id="edit-file-upload"
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="edit-file-upload" 
                  style={{ 
                    backgroundColor: 'var(--primary-accent, #38bdf8)', 
                    color: '#ffffff', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer' 
                  }}
                >
                  Choose New File
                </label>
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}