

const GEMINI_MODEL = "gemini-3.6-flash";

export async function POST(request) {
  const { question } = await request.json();

  if (!question || typeof question !== "string") {
    return Response.json({ error: "No question provided" }, { status: 400 });
  }

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
                "You are a voice assistant. The user is speaking to you and your reply will be read aloud by text-to-speech. " +
                "Answer in 2 4 short sentences, natural spoken sentences. Never use markdown, bullet points, headers, or asterisks. " +
                "You don't have live internet access, so for anything that may have changed very recently, answer from what " +
                "you know and briefly mention it might be out of date.",
            },
          ],
        },
        contents: [{ role: "user", parts: [{ text: question }] }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return Response.json({ error: "Upstream API error" }, { status: 502 });
    }

    const data = await response.json();
    const answer = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join(" ")
      .trim();

    return Response.json({ answer: answer || "I couldn't find an answer to that." });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}