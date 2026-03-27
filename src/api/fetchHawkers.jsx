import rawData from "../data/hawkers.json";
import csvText from '../data/postal_region.csv?raw';

// 1. Initialize an empty array to hold our lookup table
let postal_regions = [];


// 2. Create an async function to fetch and parse the CSV
async function loadPostalRegions() {
    const rows = csvText.split(/\r?\n/);

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;

        const columns = row.split(',');
        if (columns.length < 3) continue;

        const postalGroup = columns[0].trim();
        const region = columns.slice(2).join(',').trim();

        postalGroup.split(' / ').forEach(postal => {
            postal_regions[postal.trim()] = region;
        });
    }
}

// 3. Trigger the fetch
export const postalRegionsReady = loadPostalRegions();
console.log("Postal regions loaded:", postal_regions)

export function getRegionByPostalCode(postalCode) {
    if (!postalCode) return 'Other';
    const prefix = postalCode.substring(0, 2);
    return postal_regions[prefix] || 'Other';
}

/**
 * Parses the bundled GeoJSON into clean hawker centre objects.
 *
 * Data notes (from inspecting hawkers.json):
 * - 129 total records, all have valid coordinates
 * - 17 records have null ADDRESS_MYENV — we fall back to block + street
 */
export default async function fetchHawkers() {
    await postalRegionsReady; // Ensure postal regions are loaded before parsing hawkers
    const features = rawData?.features;

    if (!features) {
        throw new Error(
            "GeoJSON parse failed — rawData.features is undefined. "
        );
    }

    return features.map((feature) => {
        const props = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        // ADDRESS_MYENV is null for 17 records — build a fallback from parts
        const address =
            props.ADDRESS_MYENV?.trim() ||
            [props.ADDRESSBLOCKHOUSENUMBER, props.ADDRESSSTREETNAME]
                .filter(Boolean)
                .join(" ") ||
            "Address unavailable";

        return {
            id: props.OBJECTID,
            name: props.NAME,
            address,
            postalCode: props.ADDRESSPOSTALCODE,
            region: getRegionByPostalCode(props.ADDRESSPOSTALCODE), // derive region 
            lat,
            lng,
            status: props.STATUS
        };
    });
}