import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Kullanıcı oturumunu kontrol et
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekmektedir." },
        { status: 401 }
      );
    }

    // Kredi kontrolü
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Kullanıcı profili bulunamadı." },
        { status: 500 }
      );
    }

    if (profile.credits <= 0) {
      return NextResponse.json(
        { error: "Krediniz yetersiz. Lütfen kredinizi artırın." },
        { status: 402 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Geçerli bir prompt giriniz." },
        { status: 400 }
      );
    }

 const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: masterMockApiPrompt, // Sadece Master Prompt'u veriyoruz
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

    // Krediyi düş
    const { error: creditError } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    if (creditError) throw new Error("Kredi güncellenirken hata oluştu.");

    // Supabase'e kaydet (author_id ile birlikte)
    const { error: dbError } = await supabase.from("mock_endpoints").insert({
      slug,
      prompt: prompt.trim(),
      mock_data: mockData,
      author_id: user.id,
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
