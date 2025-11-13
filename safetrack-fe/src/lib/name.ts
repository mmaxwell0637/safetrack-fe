export function firstNameFromEmail(email: string): string {
  const namePart = email.split("@")[0] || "";
  // remove digits, turn separators into spaces
  const cleaned = namePart.replace(/\d+/g, "").replace(/[._-]+/g, " ").trim();

  // if we got multiple words, use the first one
  const token = cleaned.includes(" ") ? cleaned.split(/\s+/)[0] : cleaned;

  // if still one long token, guess first 6 letters (nice for concatenated names)
  const guess = token.length > 8 ? token.slice(0, 6) : token;

  return guess ? guess[0].toUpperCase() + guess.slice(1).toLowerCase() : "";
}