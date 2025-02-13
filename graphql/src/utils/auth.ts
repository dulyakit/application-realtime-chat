// src/utils/auth.ts

export function verifyTokenAndGetUserId(token: string): string | number | null {
  if (token === "valid-token") {
    return 123; // Example: Hardcoded user ID
  }
  return null;
}