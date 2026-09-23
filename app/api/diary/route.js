import { supabaseAdmin } from "../../../lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("diary_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase read error:", error);
    return Response.json({ error: "Could not load entries" }, { status: 500 });
  }

  return Response.json({ entries: data });
}

export async function POST(request) {
  const { question, answer } = await request.json();

  if (!answer || typeof answer !== "string") {
    return Response.json({ error: "No answer provided" }, { status: 400 });
  }

  const entryDate = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabaseAdmin
    .from("diary_entries")
    .insert([{ question, answer, entry_date: entryDate }])
    .select()
    .single();

  if (error) {
    console.error("Supabase write error:", error);
    return Response.json({ error: "Could not save entry" }, { status: 500 });
  }

  return Response.json({ entry: data });
}