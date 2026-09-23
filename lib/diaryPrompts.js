
const PROMPTS = [
  "What is one thing that made you smile today?",
  "What is something you are proud of today?",
  "What has been on your mind lately?",
  "What a small win  did you have today?",
  "What are you looking forward to?",
  "What is something you learned recently?",
  "How are you really feeling right now?",
  "What is  one thing you would like to let go of today?",
  "Who or what are you grateful for today?",
  "What is a challenge you faced today, and how did you handle it?",
  "What is something you would tell your morning self, looking back on today?",
  "What is  a moment from today you want to remember?",
  "What  frustrated you today, and why?",
  "What is one small thing you could do tomorrow to make it a good day?",
  "What conversation  stuck with you recently?",
  "What are you avoiding right now, and what would happen if you faced it?",
  "What is something you did today that felt true to who you are?",
  "What is one fear you are sitting with at the moment?",
  "What have you been curious about lately?",
  "If today had a title or song, what would it be?",
];


export function getTodayPrompt() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diffMs = now - start;
  const dayOfYear = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return PROMPTS[dayOfYear % PROMPTS.length];
}