import { useState, useEffect, use } from 'react'
import fetchHawkers from './api/fetchHawkers'
import './App.css'
import MapView from './components/Map/MapView'

function App() {
  const [hawkers, setHawkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedHawkerId, setSelectedHawkerId] = useState(null)

  useEffect(() => {
    fetchHawkers()
      .then(data => {
        setHawkers(data)
        console.log("Fetched hawker data:", data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching hawker data:", err)
        setError("Failed to load hawker data.")
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="app-status">Loading hawker data...</div>
  if (error) return <div className="app-error">Error: {error}</div>

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Singapore Hawker Centres</h1>
        <span className="app-count">{hawkers.length} centres</span>
      </header>

      <main className="app-main">
        <MapView
          hawkers={hawkers}
          selectedId={selectedHawkerId}
          onSelect={setSelectedHawkerId}
        />
      </main>
    </div>
  )
}

export default App
