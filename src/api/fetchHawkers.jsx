import rawData from "../data/hawkers.json";

/**
 * Parses the bundled GeoJSON into clean hawker centre objects.
 *
 * Data notes (from inspecting hawkers.json):
 * - 129 total records, all have valid coordinates
 * - 17 records have null ADDRESS_MYENV — we fall back to block + street
 */
export default async function fetchHawkers() {
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
            lat,
            lng,
            status: props.STATUS
        };
    });
}