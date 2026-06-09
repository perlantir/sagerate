import { redirect } from "next/navigation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function encodeSearchParams(params: Awaited<SearchParams>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => search.append(key, entry));
    } else if (value !== undefined) {
      search.set(key, value);
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export default async function GetQuotesRedirect({ searchParams }: { searchParams: SearchParams }) {
  redirect(`/get-rates${encodeSearchParams(await searchParams)}`);
}
