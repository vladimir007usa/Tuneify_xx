declare module 'yt-search' {
  interface VideoSearchResult {
    type: 'video';
    videoId: string;
    url: string;
    title: string;
    description: string;
    image: string;
    thumbnail: string;
    seconds: number;
    timestamp: string;
    duration: {
      toString: () => string;
      seconds: number;
      timestamp: string;
    };
    ago: string;
    views: number;
    author: {
      name: string;
      url: string;
    };
  }

  interface SearchResult {
    videos: VideoSearchResult[];
  }

  function yts(query: string): Promise<SearchResult>;
  export default yts;
}
