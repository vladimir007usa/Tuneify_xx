import { NextResponse } from 'next/server';
import yts from 'yt-search';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        const r = await yts(query);
        const videos = r.videos.slice(0, 1); // Get top 1 result

        if (videos.length === 0) {
            return NextResponse.json({ error: 'No videos found' }, { status: 404 });
        }

        return NextResponse.json({ 
            videoId: videos[0].videoId,
            title: videos[0].title,
            thumbnail: videos[0].thumbnail 
        });
    } catch (error) {
        console.error('YouTube search failed:', error);
        return NextResponse.json({ error: 'YouTube search failed' }, { status: 500 });
    }
}
