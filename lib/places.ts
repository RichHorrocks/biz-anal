const PLACES_API_BASE = "https://places.googleapis.com/v1";

const TEXT_SEARCH_FIELDS = [
  "places.id",
  "places.displayName",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.regularOpeningHours",
  "places.photos",
  "places.primaryType",
  "places.primaryTypeDisplayName",
  "places.location",
  "places.formattedAddress",
  "places.businessStatus",
].join(",");

export type GooglePlace = {
  id: string;
  displayName: { text: string };
  primaryTypeDisplayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  primaryType?: string;
  businessStatus?: string;
  location?: { latitude: number; longitude: number };
  formattedAddress?: string;
  photos?: Array<{ name: string; widthPx: number; heightPx: number }>;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
};

function apiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set");
  return key;
}

export async function textSearch(query: string): Promise<GooglePlace[]> {
  const res = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask": TEXT_SEARCH_FIELDS,
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 20 }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API ${res.status}: ${body}`);
  }

  const data = await res.json();
  return (data.places ?? []) as GooglePlace[];
}

export async function getPlaceDetails(placeId: string): Promise<GooglePlace> {
  const detailFields = TEXT_SEARCH_FIELDS.replace(/^places\./gm, "");

  const res = await fetch(`${PLACES_API_BASE}/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask": detailFields,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API ${res.status}: ${body}`);
  }

  return (await res.json()) as GooglePlace;
}
