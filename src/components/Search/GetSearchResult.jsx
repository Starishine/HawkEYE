/**
 * hooks/useSearch.js
 *
 * Owns all search + filter state and returns a derived `filtered` array.
 * Completely decoupled from UI — receives the full hawkers array as input.
 *
 * Filters applied (in order):
 *   1. Text search  — matches name or address (case-insensitive)
 *   2. Status filter — only show selected statuses
 *
 * Usage:
 *   const {
 *     filtered,
 *     query, setQuery,
 *     activeStatuses, toggleStatus,
 *     resetFilters,
 *     ALL_STATUSES,
 *   } = useSearch(hawkers)
 */

import { useState, useMemo } from 'react'

export const ALL_STATUSES = [
    'Existing',
    'Existing (new)',
    'Existing (replacement)',
    'Interim Centre',
    'Under Construction',
]

export function useSearch(hawkers) {
    const [query, setQuery] = useState('')
    const [activeStatuses, setActiveStatuses] = useState(new Set(ALL_STATUSES))

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()

        return hawkers.filter(h => {
            // 1. Text match
            if (q) {
                const inName = h.name.toLowerCase().includes(q)
                const inAddress = h.address.toLowerCase().includes(q)
                const inPostal = h.postalCode?.includes(q)
                if (!inName && !inAddress && !inPostal) return false
            }

            // 2. Status filter
            if (!activeStatuses.has(h.status)) return false

            return true
        })
    }, [hawkers, query, activeStatuses])

    function toggleStatus(status) {
        setActiveStatuses(prev => {
            const next = new Set(prev)
            next.has(status) ? next.delete(status) : next.add(status)
            return next
        })
    }

    function resetFilters() {
        setQuery('')
        setActiveStatuses(new Set(ALL_STATUSES))
    }

    return {
        filtered,
        query,
        setQuery,
        activeStatuses,
        toggleStatus,
        resetFilters,
        ALL_STATUSES,
    }
}