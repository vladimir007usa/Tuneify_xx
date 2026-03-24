export interface ITunesData {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  previewUrl: string;
  youtubeId?: string;
}

/**
 * Fetches search results from the iTunes Search API.
 * Supports both songs and podcast episodes.
 * artworkUrl100/artworkUrl160 is transformed to 600x600 for high resolution.
 */
export const fetchITunesData = async (term: string, entity: 'song' | 'podcastEpisode' = 'song', limit: number = 10): Promise<ITunesData[]> => {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&limit=${limit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((result: any) => {
      // Handle the high res trick for different iTunes API fields (artworkUrl100 vs artworkUrl160/600)
      let rawThumb = result.artworkUrl600 || result.artworkUrl160 || result.artworkUrl100 || '';
      
      return {
        id: result.trackId ? result.trackId.toString() : result.collectionId.toString(),
        title: result.trackName || result.collectionName,
        artist: result.artistName || result.collectionName || 'Unknown Podcast',
        thumbnail: rawThumb.replace('160x160', '600x600').replace('100x100', '600x600'),
        previewUrl: result.episodeUrl || result.previewUrl || result.feedUrl || ''
      };
    });
  } catch (error) {
    console.error("iTunes Search API failed:", error);
    return [];
  }
};
