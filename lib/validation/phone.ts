export type PhoneValidationResult = {
  valid: boolean;
  type: "mobile" | "landline" | "voip" | "unknown";
  verified: boolean;
};

export async function validatePhone(phone: string): Promise<PhoneValidationResult> {
  const digits = phone.replace(/\D/g, "");
  if (!process.env.REAL_PHONE_VALIDATION_API_KEY) {
    return { valid: digits.length === 10, type: "unknown", verified: false };
  }

  try {
    const url = new URL("https://api.realphonevalidation.com/rpvWebService/RealPhoneValidationTurbo.php");
    url.searchParams.set("output", "json");
    url.searchParams.set("phone", digits);
    url.searchParams.set("token", process.env.REAL_PHONE_VALIDATION_API_KEY);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Phone validation failed");
    const data = (await response.json()) as { status?: string; line_type?: string };
    const type = data.line_type?.toLowerCase().includes("mobile") ? "mobile" : "unknown";
    return { valid: data.status === "connected" || digits.length === 10, type, verified: true };
  } catch {
    return { valid: digits.length === 10, type: "unknown", verified: false };
  }
}
