import React, { useState } from 'react'
import { supabase } from './supabaseClient'
import Papa from 'papaparse'

function hashKey({ name, phone, email }) {
  const toHash = `${name}-${phone}-${email}`
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(toHash))
    .then(buffer => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join(''))
}

function App() {
  const [status, setStatus] = useState("")
  const [hashedRows, setHashedRows] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")

  const handleLogin = () => {
    if (passwordInput === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      setStatus("Incorrect password.")
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setStatus("Parsing...")

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data

        const processedRows = await Promise.all(rows.map(async (row) => {
          const hash = await hashKey(row)
          return {
            id: hash,
            name: row.name,
            phone: row.phone,
            email: row.email,
            attendance: false
          }
        }))

        setHashedRows(processedRows)
        setStatus("Parsed. Click submit to upload.")
      }
    })
  }

  const handleSubmit = async () => {
    if (hashedRows.length === 0) {
      setStatus("No data to upload.")
      return
    }

    setStatus("Uploading to Supabase...")

    const { error } = await supabase
      .from('ticket_info')
      .upsert(hashedRows, { onConflict: ['id'] })

    if (error) {
      console.error(error)
      setStatus("Upload failed.")
    } else {
      setStatus("Upload successful!")
    }
  }

  const handleClearDatabase = async () => {
    setStatus("Clearing database...")

    const { error } = await supabase
      .from('ticket_info')
      .delete()
      .neq('id', '')  // This should match every row because the ID is never empty

    if (error) {
      console.error(error)
      setStatus("Failed to clear database.")
    } else {
      setStatus("Database cleared successfully!")
    }
  }



  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handleLogin} style={{ marginLeft: '1rem' }}>Login</button>
        <p>{status}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Upload CSV to ISPH TEDx Database</h2>
      <input type="file" accept=".csv" onChange={handleUpload} />
      {hashedRows.length > 0 && (
        <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
          Submit to Supabase
        </button>
      )}
      {/* Button to clear the database */}
      <button onClick={handleClearDatabase} style={{ marginTop: '1rem', backgroundColor: 'red', color: 'white' }}>
        Clear Database
      </button>
      <p>{status}</p>
    </div>
  )
}

export default App
