/**
 * Human-like AI Response System
 * Makes AI responses feel more natural and personal
 */

import { supabase } from './supabase';

// Personality traits for Veya
const VEYA_PERSONALITY = `You are Veya, a warm and mystical astrology guide. Your personality:
- Speak like a wise, caring friend (not a corporate AI)
- Use casual language with occasional mystical flair
- Show genuine interest in the user's life
- Remember details they've shared
- Be playful but insightful
- Use emojis sparingly but meaningfully ✨
- Never start with "I" - vary your sentence openings
- Ask follow-up questions to show you care
- Validate feelings before giving advice`;

// Response style variations
const OPENING_STYLES = [
  "Ooh, ",
  "Hmm, ",
  "You know what? ",
  "Here's the cosmic tea: ",
  "The stars are saying... ",
  "Let me tune in... ",
  "Interesting! ",
  "So, ",
];

const CLOSING_STYLES = [
  " What do you think?",
  " Does that resonate?",
  " How does that land for you?",
  " 💫",
  " Trust your gut on this one.",
  "",
  " The universe has your back.",
];

export function makeResponseHuman(response: string): string {
  // Add variety to openings if response starts generically
  if (response.startsWith("Based on") || response.startsWith("According to")) {
    const opener = OPENING_STYLES[Math.floor(Math.random() * OPENING_STYLES.length)];
    response = opener + response.charAt(0).toLowerCase() + response.slice(1);
  }
  
  // Add natural closing if response ends abruptly
  if (!response.endsWith("?") && !response.endsWith("!") && !response.endsWith("💫")) {
    const closer = CLOSING_STYLES[Math.floor(Math.random() * CLOSING_STYLES.length)];
    response = response + closer;
  }
  
  return response;
}

export function buildHumanPrompt(userMessage: string, context: {
  userName?: string;
  zodiacSign?: string;
  previousTopics?: string[];
  mood?: string;
}): string {
  let prompt = VEYA_PERSONALITY + "\n\n";
  
  if (context.userName) {
    prompt += `User's name: ${context.userName}\n`;
  }
  if (context.zodiacSign) {
    prompt += `Their sign: ${context.zodiacSign}\n`;
  }
  if (context.mood) {
    prompt += `They seem: ${context.mood}\n`;
  }
  if (context.previousTopics?.length) {
    prompt += `Recently discussed: ${context.previousTopics.join(", ")}\n`;
  }
  
  prompt += `\nUser says: "${userMessage}"\n\nRespond naturally as Veya:`;
  
  return prompt;
}

// Detect user mood from message
export function detectMood(message: string): string {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes("worried") || lowerMsg.includes("anxious") || lowerMsg.includes("scared")) {
    return "anxious";
  }
  if (lowerMsg.includes("happy") || lowerMsg.includes("excited") || lowerMsg.includes("great")) {
    return "positive";
  }
  if (lowerMsg.includes("sad") || lowerMsg.includes("down") || lowerMsg.includes("depressed")) {
    return "low";
  }
  if (lowerMsg.includes("confused") || lowerMsg.includes("lost") || lowerMsg.includes("unsure")) {
    return "seeking guidance";
  }
  if (lowerMsg.includes("love") || lowerMsg.includes("relationship") || lowerMsg.includes("partner")) {
    return "romantic";
  }
  
  return "neutral";
}
