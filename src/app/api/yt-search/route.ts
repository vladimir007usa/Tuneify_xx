import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    if (!API_KEY) {
        return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    try {
        // Use the official YouTube Data API v3 (HTTP request — works on Vercel)
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error('YouTube API error:', data.error.message);
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        if (!data.items || data.items.length === 0) {
            return NextResponse.json({ error: 'No videos found' }, { status: 404 });
        }

        const video = data.items[0];
        return NextResponse.json({ 
            videoId: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url
        });
    } catch (error) {
        console.error('YouTube search failed:', error);
        return NextResponse.json({ error: 'YouTube search failed' }, { status: 500 });
    }
}
