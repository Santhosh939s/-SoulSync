import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // Simulate "thinking" delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const body = await req.json();
    const { messages } = body;

    // Basic logic to determine response based on last message
    // In a real app, this would call Gemini API

    // For MVP, return the fixed JSON structure as requested
    const response = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: "I hear that you're feeling overwhelmed. It's completely valid to feel that way during hackathons. Taking a pause is productive, not lazy.",
        action: "music_therapy",
        music_data: {
            videoId: "lTRiuFIWV54",
            title: "Slow Lofi for Focus",
            reason: "This track has a steady rhythm to help you ground your thoughts without distraction."
        }
    };

    return NextResponse.json(response);
}
