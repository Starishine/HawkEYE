/**
 * Component for displaying the user's current location on the map as a marker, and optionally flying to that location when it changes.
 * Uses Leaflet's divIcon to create a custom marker style.
 * The FlyToUserLocation component listens for changes in the user's position and animates the map to that location.
 */

import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'

function createUserLocationIcon() {
    return L.divIcon({
        className: 'user-location-icon-wrap',
        html: '<span class="user-location-icon"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
    })
}
// FLy to user location when it changes
export function FlyToUserLocation({ position }) {
    const map = useMap()

    useEffect(() => {
        if (!position) {
            return
        }

        map.flyTo(position, 15, { duration: 0.8 })
    }, [position, map])

    return null
}

// Simple marker component to show the user's location with a popup
export default function UserLocationMarker({ position }) {
    const icon = useMemo(() => createUserLocationIcon(), [])

    if (!position) {
        return null
    }

    return (
        <Marker position={position} icon={icon}>
            <Popup>You are here!</Popup>
        </Marker>
    )
}
