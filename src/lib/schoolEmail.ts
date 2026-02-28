/**
 * School email verification for college students only.
 * Validates that the email domain is a recognized educational institution.
 */

const EDUCATIONAL_TLDS = [
  ".edu",      // US
  ".edu.au",   // Australia
  ".ac.uk",    // UK
  ".ac.nz",    // New Zealand
  ".ac.in",    // India
  ".edu.ph",   // Philippines
  ".edu.sg",   // Singapore
  ".edu.my",   // Malaysia
];

/** Known college/university second-level domains (e.g. "ucla" in ucla.edu) */
const KNOWN_EDU_DOMAINS = new Set([
  "uci", "ucla", "berkeley", "stanford", "mit", "harvard", "yale", "cornell",
  "usc", "nyu", "columbia", "upenn", "umich", "utexas", "gatech", "cmu",
  "caltech", "princeton", "duke", "northwestern", "uchicago", "brown",
  "dartmouth", "vanderbilt", "rice", "nd", "georgetown", "bu",
  "bc", "syr", "purdue", "osu", "umn", "wisc", "illinois", "ua",
  "university", "college", "school", "institute", "polytechnic",
]);

function getDomain(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at === -1) return null;
  return trimmed.slice(at + 1);
}

/**
 * Returns true if the email appears to be from a school/college domain.
 * - Must contain @
 * - Domain must end with a known educational TLD (.edu, .ac.uk, etc.)
 *   OR be a known .edu subdomain (e.g. mail.uci.edu)
 */
export function isValidSchoolEmail(email: string): boolean {
  const domain = getDomain(email);
  if (!domain) return false;

  const lower = domain.toLowerCase();

  for (const tld of EDUCATIONAL_TLDS) {
    if (lower === tld.slice(1) || lower.endsWith(tld)) return true;
  }

  // e.g. name@something.edu
  if (lower.endsWith(".edu")) {
    const parts = lower.slice(0, -4).split(".");
    const main = parts[parts.length - 1] ?? "";
    if (KNOWN_EDU_DOMAINS.has(main)) return true;
    // Allow any *.edu for flexibility (many colleges use subdomains)
    return true;
  }

  return false;
}

export function getSchoolEmailError(email: string): string | null {
  if (!email.trim()) return "Please enter your email.";
  if (!email.includes("@")) return "Please enter a valid email address.";
  if (!isValidSchoolEmail(email)) {
    return "Please use your college or university email (e.g. name@school.edu).";
  }
  return null;
}
