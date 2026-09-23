"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export const STATUS = {
  IDLE: "idle",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
  ERROR: "error",
};


const PREFERRED_VOICE_HINTS = [
  "Natural", 
  "Google US English",
  "Google UK English Female",
  "Samantha",
  "Aria", 
];

function pickBestVoice(voices) {
  const englishVoices = voices.filter((v) => v.lang?.startsWith("en"));
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  for (const hint of PREFERRED_VOICE_HINTS) {
    const match = pool.find((v) => v.name.includes(hint));
    if (match) return match;
  }


  const network = pool.find((v) => !v.localService);
  return network || pool[0] || null;
}


export function useVoice() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState("");
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(null);

  const recognitionRef = useRef(null);
  const onResultRef = useRef(null); 
  const utteranceRef = useRef(null); 
 

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      if (onResultRef.current) onResultRef.current(spokenText);
    };

    recognition.onerror = (event) => {
      setStatus(STATUS.ERROR);
      setErrorMsg(`Microphone error: ${event.error}`);
    };

    recognition.onend = () => {
      setStatus((prev) => (prev === STATUS.LISTENING ? STATUS.IDLE : prev));
    };

    recognitionRef.current = recognition;
  }, []);


  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length === 0) return;
      setVoices(available);
      setSelectedVoiceURI((prev) => prev || pickBestVoice(available)?.voiceURI || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

 
  const startListening = useCallback((onResult) => {
    if (!recognitionRef.current) return;
    onResultRef.current = onResult;
    setErrorMsg("");
    setStatus(STATUS.LISTENING);
    recognitionRef.current.start();
  }, []);

  const speak = useCallback(
    (text) => {
      if (!window.speechSynthesis || !text) {
        setStatus(STATUS.IDLE);
        return;
      }
     
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      const chosen = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (chosen) utterance.voice = chosen;

     
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setStatus(STATUS.SPEAKING);
      utterance.onend = () => setStatus(STATUS.IDLE);
      utterance.onerror = () => setStatus(STATUS.IDLE);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [voices, selectedVoiceURI]
  );

  return {
    status,
    setStatus,
    errorMsg,
    setErrorMsg,
    supported,
    startListening,
    speak,
    voices,
    selectedVoiceURI,
    setSelectedVoiceURI,
  };
}