export type EmailValidationResult = {
  valid: boolean;
  verified: boolean;
  reason?: string;
};

export async function validateEmail(email: string): Promise<EmailValidationResult> {
  if (!process.env.ZEROBOUNCE_API_KEY) {
    return { valid: /^\S+@\S+\.\S+$/.test(email), verified: false };
  }

  try {
    const url = new URL("https://api.zerobounce.net/v2/validate");
    url.searchParams.set("api_key", process.env.ZEROBOUNCE_API_KEY);
    url.searchParams.set("email", email);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Email validation failed");
    const data = (await response.json()) as { status?: string; sub_status?: string };
    return { valid: ["valid", "catch-all", "unknown"].includes(data.status ?? ""), verified: true, reason: data.sub_status };
  } catch {
    return { valid: true, verified: false };
  }
}
