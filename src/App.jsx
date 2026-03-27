import { useState, useEffect, use } from 'react'
import fetchHawkers from './api/fetchHawkers'
import './App.css'
import MapView from './components/Map/MapView'
import SearchHawkers from './components/Search/SearchHawkers'

function App() {
  const [hawkers, setHawkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedHawkerId, setSelectedHawkerId] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')

  // Compute filtered hawkers based on search query and region
  const visibleHawkers = hawkers.filter(h => {
    const nameMatch = h.name.toLowerCase().includes(searchQuery.toLowerCase())
    const regionMatch = selectedRegion === 'All' || h.region === selectedRegion
    return nameMatch && regionMatch
  })

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
        <button
          type="button"
          className="app-header__search-btn"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Toggle search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        <h1>Singapore Hawker Centres</h1>
        <span className="app-count">{hawkers.length} centres</span>
      </header>

      <main className="app-main">
        <MapView
          hawkers={visibleHawkers}
          selectedId={selectedHawkerId}
          onSelect={setSelectedHawkerId}
          selectedRegion={selectedRegion}
        />
      </main>

      <SearchHawkers
        hawkers={hawkers}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        selectedHawkerId={selectedHawkerId}
        onSelectHawker={setSelectedHawkerId}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />
    </div>
  )
}

export default App
