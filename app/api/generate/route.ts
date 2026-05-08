import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Geçerli bir prompt giriniz." },
        { status: 400 }
      );
    }

    // OpenAI JSON Mode çağrısı
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are a mock API data generator. Your sole job is to return a single valid JSON object or array based on the user's description.

Rules:
- Always return ONLY raw JSON — no markdown, no explanation, no code fences.
- If the user asks for a list/array, return a JSON object with a "data" key containing the array.
- If the user asks for a single object, return a JSON object.
- Make the data realistic and varied (use real-looking names, emails, addresses, prices, dates, etc.).
- Respect the quantity requested (e.g. "50 users" → "data" array of 50 items).
- Field names must be camelCase.
- Dates must be ISO 8601 format.
- Do not include any metadata wrapper — just the raw JSON data.`,
        },
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
    });

    const rawJson = completion.choices[0].message.content;
    if (!rawJson) throw new Error("OpenAI boş yanıt döndü.");

    let mockData: unknown;
    try {
      mockData = JSON.parse(rawJson);
    } catch {
      throw new Error("OpenAI geçersiz JSON döndü.");
    }

    // Benzersiz slug üret
    const slug = Math.random().toString(36).substring(2, 10);

    // Supabase'e kaydet
    const { error: dbError } = await supabase.from("mock_endpoints").insert({
      slug,
      prompt: prompt.trim(),
      mock_data: mockData,
    });

    if (dbError) throw new Error(dbError.message);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    return NextResponse.json({
      slug,
      url: `${baseUrl}/api/v1/${slug}`,
      preview: mockData,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
