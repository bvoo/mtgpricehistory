import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; store: string }> }) {
    const { id, store } = await params;

    const validStores = ['tcgplayer', 'cardmarket', 'cardkingdom', 'starcitygames'];
    if (!validStores.includes(store)) {
        return NextResponse.json({ error: 'Invalid store' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.mtgstocks.com/prints/${id}/prices/${store}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(`MTGStocks API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Price API error:', error);
        return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 });
    }
}
