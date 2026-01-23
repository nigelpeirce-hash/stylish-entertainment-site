/**
 * Smart Name Helper Functions
 * Handles name cleaning, splitting, and formatting for bookings
 */

/**
 * Cleans and normalizes a name string
 * Handles "&", "and", extra spaces, and common formatting issues
 */
export function cleanName(name: string): string {
  if (!name) return "";
  
  return name
    .trim()
    // Replace multiple spaces with single space
    .replace(/\s+/g, " ")
    // Normalize "&" and "and" separators
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+and\s+/gi, " & ")
    // Remove trailing/leading separators
    .replace(/^[&\s]+|[&\s]+$/g, "")
    .trim();
}

/**
 * Extracts display name from a full name string
 * Handles couples, individuals, and companies
 * 
 * Examples:
 * - "Sarah & Mike" → "Sarah & Mike"
 * - "Sarah and Mike" → "Sarah & Mike"
 * - "Nigel Peirce" → "Nigel Peirce"
 * - "Stylish Ambience Ltd" → "Stylish Ambience Ltd"
 * - "TBC" → "TBC"
 */
export function getDisplayName(name: string): string {
  const cleaned = cleanName(name);
  
  // Allow "TBC" without modification
  if (cleaned.toUpperCase() === "TBC") {
    return "TBC";
  }
  
  return cleaned;
}

/**
 * Extracts greeting name from a full name string
 * For couples, uses both names; for individuals, uses first name
 * 
 * Examples:
 * - "Sarah & Mike" → "Sarah & Mike"
 * - "Sarah and Mike" → "Sarah & Mike"
 * - "Nigel Peirce" → "Nigel"
 * - "Stylish Ambience Ltd" → "Stylish Ambience"
 */
export function getGreetingName(name: string): string {
  const cleaned = cleanName(name);
  
  // Allow "TBC" without modification
  if (cleaned.toUpperCase() === "TBC") {
    return "TBC";
  }
  
  // Check if it's a couple (contains "&" or "and")
  if (cleaned.includes("&") || cleaned.toLowerCase().includes(" and ")) {
    return cleaned; // Return full couple name
  }
  
  // For individuals or companies, extract first part
  const parts = cleaned.split(/\s+/);
  if (parts.length > 0) {
    // If it looks like a company (contains Ltd, Inc, etc.), return first two words
    if (/\b(ltd|inc|llc|corp|company|co\.?)\b/i.test(cleaned)) {
      return parts.slice(0, 2).join(" ");
    }
    // Otherwise, return first name
    return parts[0];
  }
  
  return cleaned;
}

/**
 * Validates if a name format is acceptable
 * Allows couples, individuals, companies, and "TBC"
 */
export function isValidNameFormat(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }
  
  const cleaned = cleanName(name);
  
  // Allow "TBC"
  if (cleaned.toUpperCase() === "TBC") {
    return true;
  }
  
  // Must have at least 2 characters
  if (cleaned.length < 2) {
    return false;
  }
  
  // Should not be just special characters
  if (!/[a-zA-Z]/.test(cleaned)) {
    return false;
  }
  
  return true;
}

/**
 * Deduplicates name strings that contain repeated substrings
 * Handles cases like "Tim & SarahTim & Sarah" → "Tim & Sarah"
 * Also handles "Tim & Sarah & Tim & Sarah" → "Tim & Sarah"
 */
export function deduplicateName(name: string): string {
  if (!name) return "";
  
  const cleaned = cleanName(name);
  
  // First, check for the specific pattern "Tim & SarahTim & Sarah" (no space before second occurrence)
  // This pattern occurs when names are concatenated without a separator
  // Pattern: "Name1 & Name2Name1 & Name2" where Name2Name1 is concatenated
  // Example: "Tim & SarahTim & Sarah" → "Tim & Sarah"
  const concatenatedPattern1 = /^(.+?)\s*&\s*(.+?)\1\s*&\s*\2$/i;
  const concatMatch1 = cleaned.match(concatenatedPattern1);
  if (concatMatch1 && concatMatch1[1] && concatMatch1[2]) {
    return cleanName(`${concatMatch1[1]} & ${concatMatch1[2]}`);
  }
  
  // Check for "Tim & SarahTim & Sarah" pattern where second name is concatenated to first
  // Pattern: "Name1 & Name2Name1 & Name2" - where Name2Name1 is concatenated (e.g., "SarahTim")
  // Try to find where Name2 ends and Name1 begins in the concatenated part
  const concatenatedPattern2 = /^(.+?)\s*&\s*(.+?)\s*&\s*(.+?)$/i;
  const concatMatch2 = cleaned.match(concatenatedPattern2);
  if (concatMatch2 && concatMatch2[1] && concatMatch2[2] && concatMatch2[3]) {
    const firstPart = concatMatch2[1].trim();
    const middlePart = concatMatch2[2].trim(); // This might be "SarahTim"
    const lastPart = concatMatch2[3].trim(); // This should be "Sarah"
    
    // Check if middlePart ends with firstPart (e.g., "SarahTim" ends with "Tim")
    if (middlePart.toLowerCase().endsWith(firstPart.toLowerCase())) {
      // Extract just the second name without the concatenated first name
      const secondName = middlePart.slice(0, -firstPart.length).trim();
      // Verify that lastPart matches secondName
      if (lastPart.toLowerCase() === secondName.toLowerCase()) {
        return cleanName(`${firstPart} & ${secondName}`);
      }
    }
  }
  
  // Check for "Tim & Sarah & Tim & Sarah" (with spaces, full duplication)
  const fullDuplicatePattern = /^(.+?)\s*&\s*(.+?)\s*&\s*\1\s*&\s*\2$/i;
  const fullMatch = cleaned.match(fullDuplicatePattern);
  if (fullMatch && fullMatch[1] && fullMatch[2]) {
    return cleanName(`${fullMatch[1]} & ${fullMatch[2]}`);
  }
  
  // Check for exact duplicate patterns first
  const exactPatterns = [
    // Pattern: "NameName" (exact duplicate, no separator)
    /^(.+)\1$/,
    // Pattern: "Name Name" (duplicate with space)
    /^(.+)\s+\1$/i,
    // Pattern: "Name & Name" (duplicate with & separator)
    /^(.+)\s*&\s*\1$/i,
  ];
  
  for (const pattern of exactPatterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      // Found a duplicate, return just the first occurrence
      return cleanName(match[1]);
    }
  }
  
  // Check for substring duplication without separator (e.g., "Tim & SarahTim & Sarah")
  // Look for pattern where name appears twice, possibly with different casing/spacing
  const noSeparatorPattern = /^(.+?)(?:\s*&\s*)?(.+?)\1(?:\s*&\s*)?\2$/i;
  const noSepMatch = cleaned.match(noSeparatorPattern);
  if (noSepMatch && noSepMatch[1] && noSepMatch[2]) {
    // Found pattern like "Tim & SarahTim & Sarah"
    return cleanName(`${noSepMatch[1]} & ${noSepMatch[2]}`);
  }
  
  // Check for concatenated duplicates (e.g., "Tim & SarahTim & Sarah")
  // Try to find where a name pattern repeats
  const concatPattern = /^(.+?)(?:\s*&\s*)(.+?)\1(?:\s*&\s*)?\2$/i;
  const concatMatch3 = cleaned.match(concatPattern);
  if (concatMatch3 && concatMatch3[1] && concatMatch3[2]) {
    return cleanName(`${concatMatch3[1]} & ${concatMatch3[2]}`);
  }
  
  // Check if the entire string is duplicated (split in half)
  // This handles "Tim & SarahTim & Sarah" by finding the midpoint
  // Normalize function for comparison (remove all spaces, &, and case)
  const normalizeForComparison = (str: string) => cleanName(str).toLowerCase().replace(/\s+/g, "").replace(/&/g, "");
  
  // Try different split points to find duplicate pattern
  // For "Tim & SarahTim & Sarah", the split might not be exactly in the middle
  for (let splitRatio = 0.4; splitRatio <= 0.6; splitRatio += 0.05) {
    const splitPoint = Math.floor(cleaned.length * splitRatio);
    const testFirst = cleaned.substring(0, splitPoint).trim();
    const testSecond = cleaned.substring(splitPoint).trim();
    
    if (testFirst.length < 3 || testSecond.length < 3) continue;
    
    const firstNorm = normalizeForComparison(testFirst);
    const secondNorm = normalizeForComparison(testSecond);
    
    // If normalized versions match, we found the duplicate
    if (firstNorm === secondNorm && firstNorm.length > 0) {
      return cleanName(testFirst);
    }
    
    // Check if second half contains the first half pattern (handles concatenated duplicates)
    if (firstNorm.length > 3 && secondNorm.includes(firstNorm)) {
      // Try to extract just the first occurrence
      const remainder = secondNorm.replace(firstNorm, "").trim();
      // If remainder is small or empty, it's likely a duplicate
      if (remainder.length <= firstNorm.length * 0.3) {
        return cleanName(testFirst);
      }
    }
  }
  
  // Fallback: simple midpoint check
  const mid = Math.floor(cleaned.length / 2);
  const firstHalf = cleaned.substring(0, mid).trim();
  const secondHalf = cleaned.substring(mid).trim();
  const firstNormalized = normalizeForComparison(firstHalf);
  const secondNormalized = normalizeForComparison(secondHalf);
  
  if (firstNormalized.length > 0 && firstNormalized === secondNormalized) {
    return cleanName(firstHalf);
  }
  
  // Check for repeated parts when split by "&" or "and"
  const parts = cleaned.split(/\s*(?:&|and)\s*/i).filter(p => p.trim().length > 0);
  if (parts.length >= 4) {
    // Check if first two parts match last two parts
    const firstPair = parts.slice(0, 2).join(" & ").toLowerCase();
    const secondPair = parts.slice(2, 4).join(" & ").toLowerCase();
    if (firstPair === secondPair) {
      return cleanName(parts.slice(0, 2).join(" & "));
    }
  }
  
  // No duplicates found, return cleaned name
  return cleaned;
}

/**
 * Gets name format suggestions based on input
 */
export function getNameFormatSuggestions(input: string): string[] {
  const suggestions: string[] = [];
  
  if (!input || input.length < 2) {
    return [
      "Sarah & Mike",
      "Nigel Peirce",
      "Stylish Ambience Ltd",
      "TBC"
    ];
  }
  
  const lower = input.toLowerCase();
  
  // If they're typing a couple name
  if (lower.includes("&") || lower.includes(" and ")) {
    suggestions.push("Sarah & Mike");
    suggestions.push("John & Jane");
  }
  
  // If it looks like a company
  if (/\b(ltd|inc|llc|corp|company|co\.?)\b/i.test(input)) {
    suggestions.push("Stylish Ambience Ltd");
    suggestions.push("Event Planning Co");
  }
  
  // Default suggestions
  suggestions.push("Sarah & Mike", "Nigel Peirce", "TBC");
  
  return [...new Set(suggestions)]; // Remove duplicates
}
