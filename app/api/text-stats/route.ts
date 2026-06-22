import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
    const lines = text.split("\n");

    const avgWordLength = words.length > 0
      ? +(words.reduce((sum: number, w: string) => sum + w.length, 0) / words.length).toFixed(1)
      : 0;

    const avgSentenceLength = sentences.length > 0
      ? +(words.length / sentences.length).toFixed(1)
      : 0;

    const readingTimeMin = +(words.length / 200).toFixed(1);
    const speakingTimeMin = +(words.length / 150).toFixed(1);

    // Top 5 most frequent words (excluding common stop words)
    const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "shall", "can", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "and", "but", "or", "nor", "not", "so", "yet", "both", "either", "neither", "each", "every", "all", "any", "few", "more", "most", "other", "some", "such", "no", "only", "own", "same", "than", "too", "very", "just", "because", "if", "when", "while", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "i", "me", "my", "we", "our", "you", "your", "he", "him", "his", "she", "her", "they", "them", "their"]);
    const freq: Record<string, number> = {};
    for (const w of words) {
      const lower = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (lower.length > 2 && !stopWords.has(lower)) freq[lower] = (freq[lower] || 0) + 1;
    }
    const topWords = Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    return NextResponse.json({
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lines: lines.length,
      avgWordLength,
      avgSentenceLength,
      readingTimeMinutes: readingTimeMin,
      speakingTimeMinutes: speakingTimeMin,
      topWords,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
