export const STATES = [
  { code: "AL", name: "Alabama", slug: "alabama", timezone: "Central" },
  { code: "AK", name: "Alaska", slug: "alaska", timezone: "Alaska" },
  { code: "AZ", name: "Arizona", slug: "arizona", timezone: "Mountain" },
  { code: "AR", name: "Arkansas", slug: "arkansas", timezone: "Central" },
  { code: "CA", name: "California", slug: "california", timezone: "Pacific" },
  { code: "CO", name: "Colorado", slug: "colorado", timezone: "Mountain" },
  { code: "CT", name: "Connecticut", slug: "connecticut", timezone: "Eastern" },
  { code: "DE", name: "Delaware", slug: "delaware", timezone: "Eastern" },
  { code: "DC", name: "District of Columbia", slug: "district-of-columbia", timezone: "Eastern" },
  { code: "FL", name: "Florida", slug: "florida", timezone: "Eastern" },
  { code: "GA", name: "Georgia", slug: "georgia", timezone: "Eastern" },
  { code: "HI", name: "Hawaii", slug: "hawaii", timezone: "Hawaii" },
  { code: "ID", name: "Idaho", slug: "idaho", timezone: "Mountain" },
  { code: "IL", name: "Illinois", slug: "illinois", timezone: "Central" },
  { code: "IN", name: "Indiana", slug: "indiana", timezone: "Eastern" },
  { code: "IA", name: "Iowa", slug: "iowa", timezone: "Central" },
  { code: "KS", name: "Kansas", slug: "kansas", timezone: "Central" },
  { code: "KY", name: "Kentucky", slug: "kentucky", timezone: "Eastern" },
  { code: "LA", name: "Louisiana", slug: "louisiana", timezone: "Central" },
  { code: "ME", name: "Maine", slug: "maine", timezone: "Eastern" },
  { code: "MD", name: "Maryland", slug: "maryland", timezone: "Eastern" },
  { code: "MA", name: "Massachusetts", slug: "massachusetts", timezone: "Eastern" },
  { code: "MI", name: "Michigan", slug: "michigan", timezone: "Eastern" },
  { code: "MN", name: "Minnesota", slug: "minnesota", timezone: "Central" },
  { code: "MS", name: "Mississippi", slug: "mississippi", timezone: "Central" },
  { code: "MO", name: "Missouri", slug: "missouri", timezone: "Central" },
  { code: "MT", name: "Montana", slug: "montana", timezone: "Mountain" },
  { code: "NE", name: "Nebraska", slug: "nebraska", timezone: "Central" },
  { code: "NV", name: "Nevada", slug: "nevada", timezone: "Pacific" },
  { code: "NH", name: "New Hampshire", slug: "new-hampshire", timezone: "Eastern" },
  { code: "NJ", name: "New Jersey", slug: "new-jersey", timezone: "Eastern" },
  { code: "NM", name: "New Mexico", slug: "new-mexico", timezone: "Mountain" },
  { code: "NY", name: "New York", slug: "new-york", timezone: "Eastern" },
  { code: "NC", name: "North Carolina", slug: "north-carolina", timezone: "Eastern" },
  { code: "ND", name: "North Dakota", slug: "north-dakota", timezone: "Central" },
  { code: "OH", name: "Ohio", slug: "ohio", timezone: "Eastern" },
  { code: "OK", name: "Oklahoma", slug: "oklahoma", timezone: "Central" },
  { code: "OR", name: "Oregon", slug: "oregon", timezone: "Pacific" },
  { code: "PA", name: "Pennsylvania", slug: "pennsylvania", timezone: "Eastern" },
  { code: "RI", name: "Rhode Island", slug: "rhode-island", timezone: "Eastern" },
  { code: "SC", name: "South Carolina", slug: "south-carolina", timezone: "Eastern" },
  { code: "SD", name: "South Dakota", slug: "south-dakota", timezone: "Central" },
  { code: "TN", name: "Tennessee", slug: "tennessee", timezone: "Central" },
  { code: "TX", name: "Texas", slug: "texas", timezone: "Central" },
  { code: "UT", name: "Utah", slug: "utah", timezone: "Mountain" },
  { code: "VT", name: "Vermont", slug: "vermont", timezone: "Eastern" },
  { code: "VA", name: "Virginia", slug: "virginia", timezone: "Eastern" },
  { code: "WA", name: "Washington", slug: "washington", timezone: "Pacific" },
  { code: "WV", name: "West Virginia", slug: "west-virginia", timezone: "Eastern" },
  { code: "WI", name: "Wisconsin", slug: "wisconsin", timezone: "Central" },
  { code: "WY", name: "Wyoming", slug: "wyoming", timezone: "Mountain" },
] as const;

export const STATE_CODES = STATES.map((state) => state.code);

export function getStateBySlug(slug: string) {
  return STATES.find((state) => state.slug === slug || state.code.toLowerCase() === slug.toLowerCase());
}

export function getStateName(code?: string | null) {
  return STATES.find((state) => state.code === code)?.name ?? code ?? "your state";
}
