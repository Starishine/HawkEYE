/** 
 * Renders the map view using Leaflet and React-Leaflet. 
 * It displays the map, handles user interactions, and manages the state of the map view.
*/

import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './MapView.css'
import HawkerMarker, { STATUS_COLORS } from '../Markers/HawkerMarkers'
import UserLocationMarker, { FlyToUserLocation } from '../Markers/UserLocation'
import { useEffect, useState } from 'react'

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
function MapFlyTo({ hawkers, selectedId }) {
    const map = useMap()

    useEffect(() => {
        if (!selectedId) {
            return
        }
        // Find the selected hawker centre's coordinates and fly there
        const hawker = hawkers.find(h => String(h.id) === String(selectedId))
        if (!hawker) {
            return
        }
        map.flyTo([hawker.lat, hawker.lng], 15, { duration: 0.8 })
    }, [selectedId, hawkers, map])

    return null
}

/**
 * Inner component that flies the map to fit a selected region.
 * Must be inside <MapContainer> to access the map instance.
 */
function FlyToRegion({ hawkers, selectedRegion }) {
    const map = useMap()

    useEffect(() => {
        if (!selectedRegion || selectedRegion === 'All') {
            return
        }

        // Filter hawkers in the selected region
        const regionHawkers = hawkers.filter(h => h.region === selectedRegion)
        if (regionHawkers.length === 0) {
            return
        }

        // Calculate bounds from all hawkers in the region
        const bounds = L.latLngBounds(
            regionHawkers.map(h => [h.lat, h.lng])
        )

        // Fit map to the bounds with padding
        map.fitBounds(bounds, { padding: [100, 100], duration: 0.8 })
    }, [selectedRegion, hawkers, map])

    return null
}

function MapLegend() {
    return (
        <aside className="map-legend" aria-label="Hawker status legend">
            <p className="map-legend__title">Status</p>
            <ul className="map-legend__list">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                    <li key={status} className="map-legend__item">
                        <span className="map-legend__swatch" style={{ '--legend-color': color }} />
                        <span className="map-legend__label">{status}</span>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default function MapView({ hawkers, selectedId, onSelect, selectedRegion }) {
    const [userPosition, setUserPosition] = useState(null)
    const [isLocating, setIsLocating] = useState(false)
    const [locationError, setLocationError] = useState('')

    function handleLocateUser() {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.')
            return
        }

        setIsLocating(true)
        setLocationError('')

        navigator.geolocation.getCurrentPosition(
            position => {
                setUserPosition([position.coords.latitude, position.coords.longitude])
                setIsLocating(false)
            },
            error => {
                const locationErrors = {
                    [error.PERMISSION_DENIED]: 'Location access was denied.',
                    [error.POSITION_UNAVAILABLE]: 'Location is unavailable right now.',
                    [error.TIMEOUT]: 'Location request timed out. Try again.',
                }

                setLocationError(locationErrors[error.code] ?? 'Unable to retrieve your location.')
                setIsLocating(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 0,
            }
        )
    }

    return (
        <div className="map-wrapper">
            <div className="map-locate-panel">
                <button
                    type="button"
                    className="map-locate-button"
                    onClick={handleLocateUser}
                    disabled={isLocating}
                >
                    {isLocating ? 'Locating...' : 'Find My Location'}
                </button>
                {locationError && <p className="map-locate-error">{locationError}</p>}
            </div>

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

                <MapFlyTo hawkers={hawkers} selectedId={selectedId} />
                <FlyToRegion hawkers={hawkers} selectedRegion={selectedRegion} />
                <FlyToUserLocation position={userPosition} />
                <UserLocationMarker position={userPosition} />
            </MapContainer>

            <MapLegend />
        </div>
    )
}