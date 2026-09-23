"use client";

import { useState } from "react";
import { STATUS } from "../lib/useVoice";
import { styles, statusLabel } from "../lib/styles";

export default function AskMode({ voice }) {
  const { status, setStatus, startListening, speak, errorMsg, setErrorMsg } =
    voice;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = () => {
    setQuestion("");
    setAnswer("");
    startListening(async (spokenText) => {
      setQuestion(spokenText);
      setStatus(STATUS.THINKING);
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: spokenText }),
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setAnswer(data.answer);
        speak(data.answer);
      } catch {
        setStatus(STATUS.ERROR);
        setErrorMsg(
          "Couldn't get an answer. Check your connection and try again.",
        );
      }
    });
  };

  return (
    <>
      <button
        onClick={handleAsk}
        disabled={status === STATUS.LISTENING || status === STATUS.THINKING}
        style={{
          ...styles.micButton,
          ...(status === STATUS.LISTENING ? styles.micButtonActive : {}),
        }}
      >
        {status === STATUS.LISTENING ? "Listening…" : " Tap to speak"}
      </button>

      <p style={styles.statusLabel}>{statusLabel(status)}</p>

      {question && (
        <div style={styles.block}>
          <span style={styles.blockLabel}>You asked</span>
          <p style={styles.blockText}>{question}</p>
        </div>
      )}

      {answer && (
        <div style={styles.block}>
          <span style={styles.blockLabel}>Answer</span>
          <p style={styles.blockText}>{answer}</p>
        </div>
      )}

      {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}
    </>
  );
}
