import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Handle local file selection
  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  // Drag & Drop Handlers
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

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    let finalImageUrl = imageUrl

    // If user dropped or selected a local file, upload it to Supabase Storage first
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        alert('Failed to upload image file.')
        setUploading(false)
        return
      }

      // Get public URL from Supabase Storage
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)

      finalImageUrl = urlData.publicUrl
    }

    // Insert new post into database
    const { error } = await supabase.from('posts').insert([
      {
        title: title,
        content: content,
        image_url: finalImageUrl || null,
        upvotes: 0,
        comments: []
      }
    ])

    setUploading(false)

    if (error) {
      console.error('Error creating post:', error)
      alert('Error creating post.')
    } else {
      navigate('/')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Create New Tundra Challenge</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
          <input
            type="text"
            placeholder="e.g. 2022 TRD Pro Off-Road Test"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content</label>
          <textarea
            placeholder="Tell us about your build, question, or challenge..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* --- DRAG & DROP ZONE --- */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Upload Image (Drag & Drop or File Select)
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? 'var(--primary-accent, #38bdf8)' : 'var(--card-border, #334155)'}`,
              borderRadius: '12px',
              padding: '25px',
              textAlign: 'center',
              backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.1)' : 'var(--card-bg, #1e293b)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {preview ? (
              <div>
                <img 
                  src={preview} 
                  alt="Upload preview" 
                  style={{ maxHeight: '180px', borderRadius: '8px', marginBottom: '10px' }} 
                />
                <p style={{ margin: 0, fontSize: '0.85em', color: '#94a3b8' }}>
                  {file?.name} ({Math.round(file?.size / 1024)} KB)
                </p>
                <button 
                  type="button" 
                  onClick={() => { setFile(null); setPreview(null); }}
                  style={{ marginTop: '10px', backgroundColor: '#ef4444', color: 'white', fontSize: '0.8em', padding: '4px 10px' }}
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 10px 0', fontSize: '1em' }}>📁 Drag and drop your image here, or</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="file-upload" 
                  style={{ 
                    backgroundColor: 'var(--primary-accent, #38bdf8)', 
                    color: '#ffffff', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer' 
                  }}
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        {/* --- OR URL INPUT --- */}
        {!file && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#94a3b8' }}>
              Or paste Image URL:
            </label>
            <input
              type="url"
              placeholder="https://example.com/tundra.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={uploading}
          style={{ marginTop: '10px', padding: '12px' }}
        >
          {uploading ? 'Uploading Image & Saving...' : 'Publish Challenge'}
        </button>
      </form>
    </div>
  )
}