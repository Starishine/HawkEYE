import { useState, useEffect } from 'react'
import fetchHawkers from './api/fetchHawkers'
import './App.css'


function App() {
  const [hawkers, setHawkers] = useState([])

  useEffect(() => {
    const loadHawkers = async () => {
      const data = await fetchHawkers()
      setHawkers(data)
    }
    loadHawkers()
  }, [])

  return (
    <div className="App">
      <h1>Hawker Data</h1>
      <ul>
        {hawkers.map((hawker) => (
          <li key={hawker.id}>
            {hawker.name} - {hawker.address} ({hawker.postalCode}) at ({hawker.lng}, {hawker.lat})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
