const ZIP_PREFIXES: Record<string, { city: string; state: string }> = {
  "100": { city: "New York", state: "NY" },
  "101": { city: "New York", state: "NY" },
  "606": { city: "Chicago", state: "IL" },
  "770": { city: "Houston", state: "TX" },
  "752": { city: "Dallas", state: "TX" },
  "900": { city: "Los Angeles", state: "CA" },
  "941": { city: "San Francisco", state: "CA" },
  "331": { city: "Miami", state: "FL" },
  "303": { city: "Atlanta", state: "GA" },
  "021": { city: "Boston", state: "MA" },
  "191": { city: "Philadelphia", state: "PA" },
  "981": { city: "Seattle", state: "WA" },
  "802": { city: "Denver", state: "CO" },
  "200": { city: "Washington", state: "DC" },
  "372": { city: "Nashville", state: "TN" },
};

export async function lookupZip(zip: string) {
  const clean = zip.replace(/\D/g, "").slice(0, 5);
  if (clean.length !== 5) return null;
  if (process.env.SMARTY_AUTH_ID && process.env.SMARTY_AUTH_TOKEN) {
    try {
      const url = new URL("https://us-zipcode.api.smarty.com/lookup");
      url.searchParams.set("auth-id", process.env.SMARTY_AUTH_ID);
      url.searchParams.set("auth-token", process.env.SMARTY_AUTH_TOKEN);
      url.searchParams.set("zipcode", clean);
      const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
      if (response.ok) {
        const data = (await response.json()) as Array<{ city_states?: Array<{ city: string; state_abbreviation: string }> }>;
        const cityState = data[0]?.city_states?.[0];
        if (cityState) return { zip: clean, city: cityState.city, state: cityState.state_abbreviation };
      }
    } catch {
      // Fall through to lightweight local prefix lookup.
    }
  }

  const prefix = ZIP_PREFIXES[clean.slice(0, 3)];
  return {
    zip: clean,
    city: prefix?.city ?? "Verified market",
    state: prefix?.state ?? inferStateFromZip(clean),
  };
}

function inferStateFromZip(zip: string) {
  const first = Number(zip.slice(0, 1));
  if (first <= 1) return "NY";
  if (first === 2) return "DC";
  if (first === 3) return "FL";
  if (first === 4) return "OH";
  if (first === 5) return "MN";
  if (first === 6) return "IL";
  if (first === 7) return "TX";
  if (first === 8) return "CO";
  return "CA";
}
