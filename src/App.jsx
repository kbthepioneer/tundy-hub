import { useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  useEffect(() => {
    console.log('Supabase instance initialized:', supabase)
  }, [])

  return <h1>Tundy Hub</h1>
}

export default App