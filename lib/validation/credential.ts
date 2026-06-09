import type { ProfessionDegree } from "@/lib/types";

export type CredentialVerificationResult = {
  verified: boolean;
  source: "nppes" | "state_bar_stub" | "not_applicable" | "unavailable";
  id?: string | null;
  matchedName?: string | null;
};

const NPI_DEGREES = new Set<ProfessionDegree>([
  "medical_resident",
  "md",
  "do",
  "dds",
  "dmd",
  "dpm",
  "dvm",
  "od",
  "ophthalmologist_md",
  "pharmd",
  "pa",
  "rn",
  "np",
  "crna",
  "cns",
]);

export async function verifyCredential(input: {
  firstName: string;
  lastName: string;
  state?: string | null;
  professionDegree: ProfessionDegree;
}): Promise<CredentialVerificationResult> {
  if (NPI_DEGREES.has(input.professionDegree)) {
    try {
      const url = new URL("https://npiregistry.cms.hhs.gov/api/");
      url.searchParams.set("version", "2.1");
      url.searchParams.set("first_name", input.firstName);
      url.searchParams.set("last_name", input.lastName);
      if (input.state) url.searchParams.set("state", input.state);
      url.searchParams.set("enumeration_type", "NPI-1");
      const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
      if (!response.ok) throw new Error("NPPES lookup failed");
      const data = (await response.json()) as {
        result_count?: number;
        results?: Array<{ number?: string; basic?: { first_name?: string; last_name?: string }; taxonomies?: Array<{ desc?: string }> }>;
      };
      const result = data.results?.[0];
      const taxonomyText = result?.taxonomies?.map((taxonomy) => taxonomy.desc).join(" ").toLowerCase() ?? "";
      const taxonomyMatches = /(physician|dentist|podiatrist|osteopathic|medical|dental|optometrist|pharmacist|assistant|nurse|veterinarian)/.test(taxonomyText);
      return {
        verified: Boolean(data.result_count && data.result_count > 0 && taxonomyMatches),
        source: "nppes",
        id: result?.number ?? null,
        matchedName: result?.basic ? `${result.basic.first_name ?? ""} ${result.basic.last_name ?? ""}`.trim() : null,
      };
    } catch {
      return { verified: false, source: "unavailable", id: null };
    }
  }

  if (input.professionDegree === "jd") {
    return { verified: false, source: "state_bar_stub", id: null };
  }

  return { verified: false, source: "not_applicable", id: null };
}
