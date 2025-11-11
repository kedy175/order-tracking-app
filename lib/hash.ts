// lib/hash.ts
import crypto from "crypto";

/**
 * Creates a deterministic HMAC hash of the phone number.
 * The same phone always produces the same hash (with the same secret).
 */
export function hashPhone(phone: string) {
  const secret = process.env.HASH_SECRET;
  if (!secret) {
    throw new Error("HASH_SECRET not set in environment");
  }

  // optional cleanup: remove spaces, dashes, plus signs
  const cleanPhone = phone.replace(/\D/g, "");

  return crypto
    .createHmac("sha256", secret)
    .update(cleanPhone)
    .digest("hex")
    .slice(0, 12); // shorten to 12 chars for nicer URLs
}
