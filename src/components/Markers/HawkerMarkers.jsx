/**
 * Renders a single Leaflet marker for one hawker centre.
 * Selected markers use a different colour icon.
 * Clicking opens a popup with basic info.
 *
 * Props:
 *   hawker     - HawkerCentre object
 *   isSelected - boolean
 *   onSelect   - (id: string) => void
 */

import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useMemo } from 'react'
import './HawkerMarkers.css'

// Status → badge colour mapping
export const STATUS_COLORS = {
    'Existing': '#16a34a', // green
    'Existing (new)': '#0284c7', // blue
    'Existing (replacement)': '#7c3aed', // purple
    'Interim Centre': '#d97706', // amber
    'Under Construction': '#dc2626', // red
}

function getStatusColor(status) {
    return STATUS_COLORS[status] ?? '#6b7280'
}

/**
 * Creates a Leaflet divIcon so we can fully control the marker's appearance
 * with CSS rather than relying on the default marker PNG (which has a
 * well-known Vite/webpack asset resolution bug).
 */
function createIcon(isSelected, color) {
    const PIN_WIDTH = 24
    const PIN_HEIGHT = 32
    const pinColor = isSelected ? '#030100' : color
    const selectedClass = isSelected ? ' hawker-pin--selected' : ''

    return L.divIcon({
        className: 'hawker-marker-icon', // replace Leaflet's default marker styling
        html: `<div class="hawker-pin${selectedClass}" style="--pin-color: ${pinColor};"></div>`,
        iconSize: [PIN_WIDTH, PIN_HEIGHT],
        iconAnchor: [PIN_WIDTH / 2, PIN_HEIGHT - 1],  // pin tip points to location
        popupAnchor: [0, -PIN_HEIGHT + 4], // above the pin
    })
}

export default function HawkerMarker({ hawker, isSelected, onSelect }) {
    const icon = useMemo(
        () => createIcon(isSelected, getStatusColor(hawker.status)),
        [isSelected, hawker.status]
    )

    return (
        <Marker
            position={[hawker.lat, hawker.lng]}
            icon={icon}
            eventHandlers={{
                click: () => onSelect(String(hawker.id)),
            }}
        >
            <Popup>
                <div className="hawker-popup">
                    <p className="hawker-popup__name">{hawker.name}</p>
                    <p className="hawker-popup__address">{hawker.address}</p>
                    {hawker.postalCode && (
                        <p className="hawker-popup__postal">Singapore {hawker.postalCode}</p>
                    )}
                    <span
                        className="hawker-popup__status"
                        style={{ backgroundColor: getStatusColor(hawker.status) }}
                    >
                        {hawker.status}
                    </span>
                </div>
            </Popup>
        </Marker>
    )
}