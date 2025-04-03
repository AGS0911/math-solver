import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();

  // Get the API key from environment variables
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    return NextResponse.json({ error: "Missing OpenAI API Key" }, { status: 500 });
  }

  // Use the API key in the request to OpenAI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract and solve the math problem in this image." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1000
    })
  });

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: result }, { status: response.status });
  }

  const text = result.choices[0].message.content || "N/A";

  return NextResponse.json({ result: text });
}