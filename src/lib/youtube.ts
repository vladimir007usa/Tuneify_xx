const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CACHE_PREFIX = 'yt_search_';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

export interface YouTubeSearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  previewUrl?: string;
}

const getCachedResults = (query: string): YouTubeSearchResult[] | null => {
  if (typeof window === 'undefined') return null;
  const cached = localStorage.getItem(CACHE_PREFIX + query);
  if (!cached) return null;

  try {
    const { results, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(CACHE_PREFIX + query);
      return null;
    }
    return results;
  } catch (e) {
    return null;
  }
};

const setCachedResults = (query: string, results: YouTubeSearchResult[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CACHE_PREFIX + query, JSON.stringify({
    results,
    timestamp: Date.now()
  }));
};

/**
 * Regex to clean up YouTube titles: 
 * Removes (Official Video), [HD], 4K, (Audio), etc.
 */
export const cleanTitle = (title: string): { title: string; artist: string } => {
  let cleaned = title
    .replace(/(\(|\[)(Official|Official Video|Official Music Video|HD|4K|Audio|Lyrics|Lyric Video)(\)|\])/gi, '')
    .replace(/feat\.|ft\./gi, '&')
    .replace(/\s+/g, ' ')
    .trim();

  // Attempt to split by '-' to separate Artist and Title
  const parts = cleaned.split(' - ');
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim()
    };
  }

  return { artist: 'YouTube', title: cleaned };
};

export const searchYouTube = async (query: string): Promise<YouTubeSearchResult[]> => {
  // Check Cache First
  const cached = getCachedResults(query);
  if (cached) return cached;

  if (!API_KEY) {
    console.error("YouTube API Key missing in .env.local. Please add NEXT_PUBLIC_YOUTUBE_API_KEY.");
    return [];
  }

  // Prioritize "Music" category and "Official Audio"
  const searchQuery = `${query} official audio music`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=10&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      if (data.error.message.includes("quota")) {
        console.error("YouTube API Quota Exceeded. Please try again later or check your API key configuration.");
      } else {
        console.error("YouTube API Error:", data.error.message);
      }
      return [];
    }

    if (!data.items || data.items.length === 0) {
      console.log("No YouTube results found for:", query);
      return [];
    }

    const results = data.items.map((item: any) => {
      const { title } = item.snippet;
      const { title: cleanedTitle, artist } = cleanTitle(title);
      
      return {
        id: item.id.videoId,
        title: cleanedTitle,
        artist,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url
      };
    });

    // Save to Cache
    setCachedResults(query, results);
    return results;
  } catch (error) {
    console.error("YouTube search fetch failed:", error);
    return [];
  }
};

export const getYouTubeId = async (title: string, artist: string): Promise<string | null> => {
  const query = `${title} ${artist} official audio`;
  const results = await searchYouTube(query);
  return results.length > 0 ? results[0].id : null;
};
