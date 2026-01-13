// YouTube API utility functions

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
}

/**
 * Fetch channel playlists from YouTube API
 */
export async function fetchChannelPlaylists(
  apiKey: string,
  channelId: string
): Promise<YouTubePlaylist[]> {
  try {
    // First, get the channel's uploads playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    if (!channelResponse.ok) {
      throw new Error(`YouTube API error: ${channelResponse.statusText}`);
    }

    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("Channel not found");
    }

    // Get all playlists for the channel
    const playlistsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${apiKey}`
    );

    if (!playlistsResponse.ok) {
      throw new Error(`YouTube API error: ${playlistsResponse.statusText}`);
    }

    const playlistsData = await playlistsResponse.json();

    return playlistsData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description || "",
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
      videoCount: item.contentDetails.itemCount || 0,
    }));
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
}

/**
 * Fetch videos from a specific playlist
 */
export async function fetchPlaylistVideos(
  apiKey: string,
  playlistId: string
): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description || "",
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching playlist videos:", error);
    throw error;
  }
}

/**
 * Fetch all videos from a channel (from uploads playlist)
 */
export async function fetchChannelVideos(
  apiKey: string,
  channelId: string,
  maxResults: number = 50
): Promise<YouTubeVideo[]> {
  try {
    // First, get the channel's uploads playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    if (!channelResponse.ok) {
      throw new Error(`YouTube API error: ${channelResponse.statusText}`);
    }

    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("Channel not found");
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Fetch videos from uploads playlist
    return fetchPlaylistVideos(apiKey, uploadsPlaylistId);
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    throw error;
  }
}
