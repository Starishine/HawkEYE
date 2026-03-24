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
