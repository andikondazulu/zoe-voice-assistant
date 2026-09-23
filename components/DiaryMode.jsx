"use client";

import { useEffect, useState } from "react";
import { STATUS } from "../lib/useVoice";
import { getTodayPrompt } from "../lib/diaryPrompts";
import { styles, statusLabel } from "../lib/styles";

export default function DiaryMode({ voice }) {
  const { status, setStatus, startListening, speak, errorMsg, setErrorMsg } =
    voice;
  const [prompt] = useState(getTodayPrompt());
  const [lastAnswer, setLastAnswer] = useState("");
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoadingEntries(true);
    try {
      const res = await fetch("/api/diary");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
     
    } finally {
      setLoadingEntries(false);
    }
  };

  const loadInsight = async () => {
    setLoadingInsight(true);
    setInsight("");
    try {
      const res = await fetch("/api/insights");
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setInsight(data.insight);
      speak(data.insight);
    } catch {
      setErrorMsg(
        "Couldn't generate insights right now. Try again in a moment.",
      );
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleRespond = () => {
    setSaved(false);
    setLastAnswer("");
    startListening(async (spokenAnswer) => {
      setLastAnswer(spokenAnswer);
      setStatus(STATUS.THINKING);
      try {
        const res = await fetch("/api/diary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: prompt, answer: spokenAnswer }),
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        setSaved(true);
        setStatus(STATUS.IDLE);
        speak("Got it,that's saved in your diary.");
        loadEntries();
      } catch {
        setStatus(STATUS.ERROR);
        setErrorMsg(
          "Couldn't save your entry. Check your connection and try again.",
        );
      }
    });
  };

  return (
    <>
      <div style={styles.block}>
        <span style={styles.blockLabel}>Today's question</span>
        <p style={styles.blockText}>{prompt}</p>
      </div>

      <button
        onClick={handleRespond}
        disabled={status === STATUS.LISTENING || status === STATUS.THINKING}
        style={{
          ...styles.micButton,
          ...(status === STATUS.LISTENING ? styles.micButtonActive : {}),
          marginTop: "16px",
        }}
      >
        {status === STATUS.LISTENING ? "Listening…" : "🎙 Tap to answer"}
      </button>

      <p style={styles.statusLabel}>{statusLabel(status)}</p>

      {lastAnswer && (
        <div style={styles.block}>
          <span style={styles.blockLabel}>You said</span>
          <p style={styles.blockText}>{lastAnswer}</p>
        </div>
      )}

      {saved && <p style={styles.savedNote}>Saved to your diary ✓</p>}
      {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

      <button
        onClick={loadInsight}
        disabled={loadingInsight}
        style={{
          ...styles.tabButton,
          ...styles.tabButtonActive,
          width: "100%",
          marginTop: "20px",
          padding: "10px 0",
        }}
      >
        {loadingInsight ? "Looking for patterns…" : "Advice"}
      </button>

      {insight && (
        <div style={{ ...styles.block, marginTop: "12px" }}>
          <span style={styles.blockLabel}>Here's what I am noticing</span>
          <p style={styles.blockText}>{insight}</p>
        </div>
      )}

      <div style={{ marginTop: "28px", textAlign: "left" }}>
        <span style={styles.blockLabel}> Your Past entries</span>

        {loadingEntries && <p style={styles.blockText}>Loading…</p>}

        {!loadingEntries && entries.length === 0 && (
          <p style={styles.blockText}>
            No entries yet,answer today's question to start your diary.
          </p>
        )}

        {entries.map((entry) => (
          <div key={entry.id} style={{ ...styles.block, marginTop: "10px" }}>
            <span style={styles.blockLabel}>{entry.entry_date}</span>
            <p style={{ ...styles.blockText, opacity: 0.65, fontSize: "13px" }}>
              {entry.question}
            </p>
            <p style={styles.blockText}>{entry.answer}</p>
          </div>
        ))}
      </div>
    </>
  );
}
