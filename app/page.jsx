"use client";

import { useState } from "react";
import Avatar3D from "../components/Avatar3D";
import AskMode from "../components/AskMode";
import DiaryMode from "../components/DiaryMode";
import { useVoice } from "../lib/useVoice";
import { styles } from "../lib/styles";

export default function VoiceAssistant() {
  const voice = useVoice();
  const [mode, setMode] = useState("diary");

  if (!voice.supported) {
    return (
      <main style={styles.main}>
        <div style={styles.card}>
          <p style={styles.errorText}>
            Your browser doesn't support voice recognition. Try Chrome or
            Edge on desktop or Android.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {mode === "diary" ? "Zoe diary" : "Ask out loud"}
        </h1>

        <Avatar3D status={voice.status} />

        <div style={styles.tabRow}>
          <button
            onClick={() => setMode("ask")}
            style={{
              ...styles.tabButton,
              ...(mode === "ask" ? styles.tabButtonActive : {}),
            }}
          >
            Ask
          </button>
          <button
            onClick={() => setMode("diary")}
            style={{
              ...styles.tabButton,
              ...(mode === "diary" ? styles.tabButtonActive : {}),
            }}
          >
            Diary
          </button>
        </div>

        {mode === "ask" ? <AskMode voice={voice} /> : <DiaryMode voice={voice} />}
      </div>
    </main>
  );
}