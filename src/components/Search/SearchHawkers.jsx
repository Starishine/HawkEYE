import { useMemo } from 'react'
import './SearchHawkers.css'

/**
 * SearchHawkers — side panel for searching and filtering hawker centres
 * by name and region, with clickable results.
 * 
 * Props:
 *   hawkers - array of all hawker objects
 *   isOpen - boolean to show/hide panel
 *   onClose - callback to close panel
 *   selectedHawkerId - currently selected hawker id
 *   onSelectHawker - (id: string) => void to select a hawker
 *   searchQuery - current search query text
 *   onSearchQueryChange - (query: string) => void
 *   selectedRegion - currently selected region filter
 *   onRegionChange - (region: string) => void
 */
export default function SearchHawkers({
    hawkers,
    isOpen,
    onClose,
    selectedHawkerId,
    onSelectHawker,
    searchQuery,
    onSearchQueryChange,
    selectedRegion,
    onRegionChange,
}) {
    // Extract unique regions from all hawkers
    const regions = useMemo(() => {
        const unique = new Set(hawkers.map(h => h.region).filter(Boolean))
        return Array.from(unique).sort()
    }, [hawkers])

    // Filter hawkers by query and region
    const filteredHawkers = useMemo(() => {
        return hawkers.filter(h => {
            const nameMatch = h.name.toLowerCase().includes(searchQuery.toLowerCase())
            const regionMatch = selectedRegion === 'All' || h.region === selectedRegion
            return nameMatch && regionMatch
        })
    }, [hawkers, searchQuery, selectedRegion])

    function handleClear() {
        onSearchQueryChange('')
        onRegionChange('All')
    }

    function handleSelectHawker(hawkerId) {
        onSelectHawker(String(hawkerId))
    }

    return (
        <>
            {/* Overlay to close panel */}
            {isOpen && <div className="search-overlay" onClick={onClose} aria-hidden="true" />}

            {/* Side panel */}
            <aside className={`search-panel ${isOpen ? 'search-panel--open' : ''}`}>
                <div className="search-panel__header">
                    <h2 className="search-panel__title">Search Hawkers</h2>
                    <button
                        type="button"
                        className="search-panel__close"
                        onClick={onClose}
                        aria-label="Close search"
                    >
                        ✕
                    </button>
                </div>

                <div className="search-panel__form">
                    {/* Name search input */}
                    <div className="search-form__group">
                        <label htmlFor="search-name" className="search-form__label">
                            Name
                        </label>
                        <input
                            id="search-name"
                            type="text"
                            className="search-form__input"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={e => onSearchQueryChange(e.target.value)}
                        />
                    </div>

                    {/* Region filter dropdown */}
                    <div className="search-form__group">
                        <label htmlFor="search-region" className="search-form__label">
                            Region
                        </label>
                        <select
                            id="search-region"
                            className="search-form__select"
                            value={selectedRegion}
                            onChange={e => onRegionChange(e.target.value)}
                        >
                            <option value="All">All Regions</option>
                            {regions.map(region => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear button */}
                    <button
                        type="button"
                        className="search-form__button"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>

                {/* Results count */}
                <p className="search-panel__count">
                    {filteredHawkers.length} result{filteredHawkers.length !== 1 ? 's' : ''}
                </p>

                {/* Results list */}
                <div className="search-results">
                    {filteredHawkers.length === 0 ? (
                        <p className="search-results__empty">No hawkers found.</p>
                    ) : (
                        <ul className="search-results__list">
                            {filteredHawkers.map(hawker => (
                                <li key={hawker.id} className="search-results__item">
                                    <button
                                        type="button"
                                        className={`search-result-btn ${String(hawker.id) === String(selectedHawkerId)
                                            ? 'search-result-btn--selected'
                                            : ''
                                            }`}
                                        onClick={() => handleSelectHawker(hawker.id)}
                                    >
                                        <div className="search-result-btn__name">{hawker.name}</div>
                                        <div className="search-result-btn__meta">
                                            {hawker.region} • {hawker.status}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
        </>
    )
}
