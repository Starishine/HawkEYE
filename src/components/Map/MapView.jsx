/** 
 * Renders the map view using Leaflet and React-Leaflet. 
 * It displays the map, handles user interactions, and manages the state of the map view.
*/

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './MapView.css'
import HawkerMarker from '../Markers/HawkerMarkers'
import { useEffect } from 'react'

const SG_BOUNDS = L.latLngBounds(
    L.latLng(1.144, 103.535), // Southwest corner
    L.latLng(1.494, 104.502)  // Northeast corner
)

const SG_CENTER = [1.3521, 103.8198] // Approximate center of Singapore
const SG_ZOOM = 11

/**
 * Inner component that flies the map to a selected hawker centre.
 * Must be inside <MapContainer> to access the map instance.
 */
function MapFlyTo({ hawkers, selectedId, onSelect }) {
    const map = useMap()

    useEffect(() => {
        if (!selectedId) return
        const hawker = hawkers.find(h => String(h.id) === String(selectedId))
        if (!hawker) return
        map.flyTo([hawker.lat, hawker.lng], 15, { duration: 0.8 })
    }, [selectedId, hawkers, map])

    return null
}

export default function MapView({ hawkers, selectedId, onSelect }) {
    return (
        <div className="map-wrapper">
            <MapContainer
                center={SG_CENTER}
                zoom={SG_ZOOM}
                maxBounds={SG_BOUNDS}
                maxBoundsViscosity={0.8}
                className="leaflet-map"
                // Prevent zoom from bouncing too far out
                minZoom={11}
                maxZoom={18}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hawkers.map(hawker => (
                    <HawkerMarker
                        key={hawker.id}
                        hawker={hawker}
                        isSelected={String(hawker.id) === String(selectedId)}
                        onSelect={onSelect}
                    />
                ))}

                <MapFlyTo hawkers={hawkers} selectedId={selectedId} onSelect={onSelect} />
            </MapContainer>
        </div>
    )
}