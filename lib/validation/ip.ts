export type IpFraudResult = {
  score: number | null;
  state?: string | null;
  verified: boolean;
};

export async function scoreIpAddress(ipAddress?: string | null): Promise<IpFraudResult> {
  if (!ipAddress || !process.env.IPQUALITYSCORE_API_KEY) {
    return { score: null, verified: false };
  }

  try {
    const url = new URL(`https://ipqualityscore.com/api/json/ip/${process.env.IPQUALITYSCORE_API_KEY}/${ipAddress}`);
    url.searchParams.set("strictness", "1");
    const response = await fetch(url);
    if (!response.ok) throw new Error("IP fraud scoring failed");
    const data = (await response.json()) as { fraud_score?: number; region?: string };
    return { score: data.fraud_score ?? null, state: data.region ?? null, verified: true };
  } catch {
    return { score: null, verified: false };
  }
}
