import { STATUS } from "./useVoice";

export function statusLabel(status) {
  switch (status) {
    case STATUS.LISTENING:
      return "Listening — go ahead";
    case STATUS.THINKING:
      return "One moment…";
    case STATUS.SPEAKING:
      return "Speaking…";
    case STATUS.ERROR:
      return "Something went wrong";
    default:
      return "Tap the mic when you are ready";
  }
}

export const styles = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111318",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: "#1b1e26",
    borderRadius: "16px",
    padding: "32px 28px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  title: {
    color: "#f4f4f6",
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "16px",
  },
  avatarWrap3d: {
    width: "100%",
    height: "200px",
    margin: "0 auto 12px",
  },
  tabRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    background: "#111318",
    borderRadius: "999px",
    padding: "4px",
  },
  tabButton: {
    flex: 1,
    border: "none",
    borderRadius: "999px",
    padding: "10px 0",
    fontSize: "14px",
    fontWeight: 500,
    background: "transparent",
    color: "#9a9fae",
    cursor: "pointer",
  },
  tabButtonActive: {
    background: "#2a2f3a",
    color: "#f4f4f6",
  },
  micButton: {
    border: "none",
    borderRadius: "999px",
    padding: "18px 28px",
    fontSize: "16px",
    fontWeight: 500,
    background: "#4f7cff",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
  },
  micButtonActive: {
    background: "#ff4f6d",
  },
  statusLabel: {
    color: "#9a9fae",
    fontSize: "14px",
    marginTop: "14px",
  },
  block: {
    marginTop: "20px",
    textAlign: "left",
    background: "#22262f",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  blockLabel: {
    color: "#7d8494",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  blockText: {
    color: "#f4f4f6",
    fontSize: "15px",
    marginTop: "6px",
    lineHeight: 1.5,
  },
  savedNote: {
    color: "#8fd694",
    fontSize: "14px",
    marginTop: "14px",
  },
  errorText: {
    color: "#ff8080",
    fontSize: "14px",
    marginTop: "16px",
  },
};