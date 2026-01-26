/**
 * Spotify API Helper
 * Uses Client Credentials Flow (no user login required)
 * Only used for searching tracks - no playlist management
 */

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  preview_url: string | null;
  external_urls: { spotify: string };
  explicit: boolean;
  duration_ms: number;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

export interface SimplifiedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string | null;
  previewUrl: string | null;
  spotifyUrl: string;
  duration: string; // Formatted as "3:45"
  explicit: boolean;
}

// Cache the token in memory
let cachedToken: SpotifyToken | null = null;

/**
 * Get Spotify access token using Client Credentials flow
 * Tokens are cached and refreshed when expired
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Spotify token error:", error);
    throw new Error("Failed to get Spotify access token");
  }

  const data = await response.json();
  
  // Cache the token with expiry time (subtract 60 seconds for safety margin)
  cachedToken = {
    ...data,
    expires_at: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.access_token;
}

/**
 * Format duration from milliseconds to "M:SS"
 */
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Search for tracks on Spotify
 * @param query - Search query (song name, artist, etc.)
 * @param limit - Number of results to return (default: 10, max: 50)
 * @param filterExplicit - If true, filters out explicit tracks (default: true)
 */
export async function searchTracks(
  query: string,
  limit: number = 10,
  filterExplicit: boolean = true
): Promise<SimplifiedTrack[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const token = await getAccessToken();
  
  // Request more results if filtering explicit, so we still get enough results
  const requestLimit = filterExplicit ? Math.min(limit * 2, 50) : limit;

  const params = new URLSearchParams({
    q: query.trim(),
    type: "track",
    market: "GB", // UK market
    limit: requestLimit.toString(),
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Spotify search error:", error);
    throw new Error("Failed to search Spotify");
  }

  const data: SpotifySearchResponse = await response.json();
  
  let tracks = data.tracks.items;
  
  // Filter out explicit tracks if requested
  if (filterExplicit) {
    tracks = tracks.filter(track => !track.explicit);
  }
  
  // Limit to requested number
  tracks = tracks.slice(0, limit);

  // Transform to simplified format
  return tracks.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || null,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    duration: formatDuration(track.duration_ms),
    explicit: track.explicit,
  }));
}

/**
 * Get a single track by ID
 */
export async function getTrack(trackId: string): Promise<SimplifiedTrack | null> {
  const token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}?market=GB`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.text();
    console.error("Spotify get track error:", error);
    throw new Error("Failed to get track from Spotify");
  }

  const track: SpotifyTrack = await response.json();

  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || null,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    duration: formatDuration(track.duration_ms),
    explicit: track.explicit,
  };
}

/**
 * Check if Spotify is configured
 */
export function isSpotifyConfigured(): boolean {
  return !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}
