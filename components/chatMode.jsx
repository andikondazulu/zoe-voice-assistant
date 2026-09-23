"use client";

import { useEffect, useRef, useState } from "react";
import { STATUS } from "../lib/useVoice";
import { getTodayPrompt } from "../lib/diaryPrompts";
import { styles, statusLabel } from "../lib/styles";

export default function ChatMode({ voice }) {
  const {
    status,
    setStatus,
    startListening,
    speak,
    errorMsg,
    setErrorMsg,
    voices,
    selectedVoiceURI,
    setSelectedVoiceURI,
  } = voice;
  const [messages, setMessages] = useState([]); 
  const [loadingInsight, setLoadingInsight] = useState(false);

 
  const pendingDiaryRef = useRef(false);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleMicTap = () => {
    startListening(async (spokenText) => {
      addMessage("user", spokenText);

     
      if (pendingDiaryRef.current) {
        pendingDiaryRef.current = false;
        setStatus(STATUS.THINKING);
        try {
          const res = await fetch("/api/diary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: getTodayPrompt(), answer: spokenText }),
          });
          if (!res.ok) throw new Error(`Server responded with ${res.status}`);
          const confirmation = "Got it — that's saved in your diary.";
          addMessage("assistant", confirmation);
          setStatus(STATUS.IDLE);
          speak(confirmation);
        } catch {
          setStatus(STATUS.ERROR);
          setErrorMsg("Couldn't save your diary entry. Try again in a moment.");
        }
        return;
      }

      
      setStatus(STATUS.THINKING);
      try {
        const history = [...messages, { role: "user", content: spokenText }];
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        addMessage("assistant", data.reply);
        speak(data.reply);
      } catch {
        setStatus(STATUS.ERROR);
        setErrorMsg("Couldn't get a response. Check your connection and try again.");
      }
    });
  };

  const askDiaryQuestion = () => {
    const prompt = getTodayPrompt();
    addMessage("assistant", prompt);
    speak(prompt);
    pendingDiaryRef.current = true;
  };

  const loadInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await fetch("/api/insights");
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      addMessage("assistant", data.insight);
      speak(data.insight);
    } catch {
      setErrorMsg("Couldn't generate insights right now. Try again in a moment.");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <>
      {voices.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <select
            value={selectedVoiceURI || ""}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            style={{
              flex: 1,
              background: "#22262f",
              color: "#f4f4f6",
              border: "1px solid #333844",
              borderRadius: "8px",
              padding: "8px 10px",
              fontSize: "13px",
            }}
          >
            {voices
              .filter((v) => v.lang?.startsWith("en"))
              .map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} {v.localService ? "" : "(network)"}
                </option>
              ))}
          </select>
          <button
            onClick={() => speak("Hi, this is what I sound like.")}
            style={{
              border: "none",
              background: "#22262f",
              color: "#9a9fae",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            ▶ Test
          </button>
        </div>
      )}

      <div
        style={{
          ...styles.block,
          maxHeight: "260px",
          overflowY: "auto",
          textAlign: "left",
        }}
      >
        {messages.length === 0 && (
          <p style={{ ...styles.blockText, opacity: 0.6 }}>
            Tap the mic and say anything, ask a question, ask for a
            recommendation, or tap "Today's diary question" below to reflect
            on your day.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <span style={styles.blockLabel}>{m.role === "user" ? "You" : "Assistant"}</span>
            <p style={styles.blockText}>{m.content}</p>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>

      <button
        onClick={handleMicTap}
        disabled={status === STATUS.LISTENING || status === STATUS.THINKING}
        style={{
          ...styles.micButton,
          ...(status === STATUS.LISTENING ? styles.micButtonActive : {}),
          marginTop: "16px",
        }}
      >
        {status === STATUS.LISTENING ? "Listening…" : " Tap to talk"}
      </button>

      <p style={styles.statusLabel}>{statusLabel(status)}</p>

      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
        <button
          onClick={askDiaryQuestion}
          disabled={status === STATUS.LISTENING || status === STATUS.THINKING}
          style={{ ...styles.tabButton, background: "#22262f", flex: 1 }}
        >
           Today's diary question
        </button>
        <button
          onClick={loadInsight}
          disabled={loadingInsight || status === STATUS.LISTENING}
          style={{ ...styles.tabButton, background: "#22262f", flex: 1 }}
        >
          {loadingInsight ? "…" : "Advice"}
        </button>
      </div>

      {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}
    </>
  );
}