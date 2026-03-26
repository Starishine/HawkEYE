/**
 * components/Search/SearchHawkers.jsx
 *
 * Sidebar panel containing:
 *   - Text search input
 *   - Status filter toggles
 *   - Scrollable results list
 *
 * Props:
 *   hawkers        - full HawkerCentre[] (unfiltered)
 *   selectedId     - string|null
 *   onSelect       - (id: string) => void
 */

import { useRef, useEffect } from 'react'
import { useSearch } from './GetSearchResult'
import { STATUS_COLORS } from '../Markers/HawkerMarkers'
import './SearchHawkers.css'

export default function SearchHawkers({ hawkers, selectedId, onSelect }) {
    const {
        filtered,
        query,
        setQuery,
        activeStatuses,
        toggleStatus,
        resetFilters,
        ALL_STATUSES,
    } = useSearch(hawkers)

    // Auto-scroll selected item into view when selectedId changes
    // (e.g. user clicked a map marker — sidebar should follow)
    const selectedRef = useRef(null)
    useEffect(() => {
        selectedRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, [selectedId])

    const hasActiveFilters = query.trim() !== '' || activeStatuses.size < ALL_STATUSES.length

    return (
        <aside className="search-panel">

            {/* ── Search input ── */}
            <div className="search-panel__header">
                <div className="search-input-wrap">
                    <svg className="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Search by name or address…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        aria-label="Search hawker centres"
                    />
                    {query && (
                        <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                            ✕
                        </button>
                    )}
                </div>

                {/* ── Status filters ── */}
                <div className="search-filters" role="group" aria-label="Filter by status">
                    {ALL_STATUSES.map(status => {
                        const active = activeStatuses.has(status)
                        const color = STATUS_COLORS[status] ?? '#6b7280'
                        return (
                            <button
                                key={status}
                                className={`filter-chip ${active ? 'filter-chip--on' : 'filter-chip--off'}`}
                                style={{ '--chip-color': color }}
                                onClick={() => toggleStatus(status)}
                                aria-pressed={active}
                            >
                                <span className="filter-chip__dot" />
                                {status}
                            </button>
                        )
                    })}
                </div>

                {/* ── Results count + reset ── */}
                <div className="search-meta">
                    <span className="search-count">
                        {filtered.length} of {hawkers.length}
                    </span>
                    {hasActiveFilters && (
                        <button className="search-reset" onClick={resetFilters}>
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* ── Results list ── */}
            <ul className="search-list" role="listbox" aria-label="Hawker centre results">
                {filtered.length === 0 && (
                    <li className="search-empty">No hawker centres match your search.</li>
                )}
                {filtered.map(hawker => {
                    const isSelected = String(hawker.id) === String(selectedId)
                    const color = STATUS_COLORS[hawker.status] ?? '#6b7280'
                    return (
                        <li
                            key={hawker.id}
                            ref={isSelected ? selectedRef : null}
                            className={`search-item ${isSelected ? 'search-item--selected' : ''}`}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => onSelect(String(hawker.id))}
                        >
                            <span className="search-item__dot" style={{ background: color }} />
                            <div className="search-item__body">
                                <p className="search-item__name">{hawker.name}</p>
                                <p className="search-item__address">{hawker.address}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>

        </aside>
    )
}