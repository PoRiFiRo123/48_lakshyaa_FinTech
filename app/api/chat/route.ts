// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    // Log the incoming request for debugging
    const { message, pageContent } = await req.json();
    console.log("Received message:", message);
    console.log("Page content:", pageContent);

    // Prepare the request data for Gemini's API
    const requestData = {
      userMessage: message, // The message user sent
      context: pageContent,  // Optional: the context (can be anything like a page description)
    };

    const geminiResponse = await axios.post('https://api.gemini.com/v1/chat', requestData, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const reply = geminiResponse.data.reply;

    // Log the response from Gemini API
    console.log("Gemini API reply:", reply);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error: 'Failed to fetch the bot reply.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
