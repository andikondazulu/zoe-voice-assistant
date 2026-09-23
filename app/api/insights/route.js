import { supabaseAdmin } from "../../../lib/supabaseClient";

const GEMINI_MODEL = "gemini-3.6-flash";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("diary_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Supabase read error:", error);
    return Response.json({ error: "Could not load entries" }, { status: 500 });
  }

  if (!data || data.length < 3) {
    return Response.json({
      insight:
        "Add a few more diary entries",
    });
  }


  const entriesText = data
    .slice()
    .reverse()
    .map((e) => `${e.entry_date} — Q: ${e.question || "(free entry)"} A: ${e.answer}`)
    .join("\n");

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text:
                "You are a supportive reflective journaling companion. The user has asked you to read their own diary " +
                "entries and help them notice patterns. Identify 2 3 genuine recurring themes, moods, or habits , only " +
                " the ones actually supported by what is written, never invented. Then offer a small number of grounded, " +
                "practical suggestions tied to those specific patterns. Keep the tone warm, direct, and non clinical: " +
                "you are not a therapist, and you must never diagnose a mental health condition or label their emotional " +
                "state with a clinical term. If the entries suggest ongoing distress, gently suggest talking to someone " +
                "they trust or a professional, without being alarmist. Write 4-6 short sentences, plain language, no " +
                "markdown, no headers, no bullet points — this may be read aloud.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Here are my recent diary entries, oldest to newest:\n\n${entriesText}\n\nWhat patterns do you notice, and what would you suggest?`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return Response.json({ error: "Upstream API error" }, { status: 502 });
    }

    const result = await response.json();
    const insight = (result.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join(" ")
      .trim();

    return Response.json({
      insight: insight || "I couldn't generate an insight right now.",
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}