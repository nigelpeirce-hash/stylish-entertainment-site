/**
 * Banned Songs/Artists List
 * Add any songs or artists to this array to block users who request them
 * 
 * Note: Entries are checked case-insensitively and against variations
 * (e.g., "YMCA" will match "Y.M.C.A.", "Y M C A", etc.)
 */

export const BANNED_SONGS_AND_ARTISTS: string[] = [
  "YMCA",
  "Y.M.C.A.",
  "Y M C A",
  "Village People",
  // Add more banned songs/artists here as needed
];

/**
 * Normalize a string for comparison (uppercase, remove punctuation and spaces)
 */
function normalizeString(str: string): string {
  return str
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") // Remove all non-alphanumeric characters
    .trim();
}

/**
 * Check if a song/artist is on the banned list
 */
export function isBanned(songOrArtist: string): boolean {
  const normalized = normalizeString(songOrArtist);
  
  return BANNED_SONGS_AND_ARTISTS.some(banned => {
    const normalizedBanned = normalizeString(banned);
    return normalized === normalizedBanned || normalized.includes(normalizedBanned) || normalizedBanned.includes(normalized);
  });
}
