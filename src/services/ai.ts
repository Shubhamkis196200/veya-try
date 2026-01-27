// AI-powered horoscope and reading generation with HUMAN-LIKE personality
import { supabase } from '../lib/supabase';

// Veya's personality - warm, mystical friend (NOT robotic AI)
const VEYA_PERSONALITY = `You are Veya, a warm and mystical astrology guide. Your personality:
- Speak like a wise, caring friend (NOT a corporate AI)
- Use casual, warm language with mystical flair
- Be playful but insightful - mix wisdom with fun
- Use emojis sparingly but meaningfully ✨🌙💫
- Never start responses with "I" - vary openings
- Keep responses concise (2-3 paragraphs max)
- Sound like a best friend who happens to know astrology
- Be encouraging and uplifting
- Add personality quirks - say things like "cosmic tea", "the stars are spilling"`;

interface ReadingRequest {
  type: 'daily' | 'love' | 'career' | 'detailed' | 'question' | 'chat';
  zodiacSign: string;
  question?: string;
  birthDate?: string;
  intent?: string;
  userName?: string;
}

// Detect user mood from message
function detectMood(message: string): string {
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

// Chat with Veya - human-like conversation
export async function chatWithVeya(message: string, zodiacSign: string, userName?: string): Promise<string> {
  try {
    const mood = detectMood(message);
    
    const { data, error } = await supabase.functions.invoke('generate-reading', {
      body: {
        type: 'chat',
        zodiacSign,
        question: message,
        userName,
        mood,
      },
    });

    if (error) throw error;
    
    // Return the response directly if it's a string
    if (typeof data === 'string') {
      return data;
    }
    
    // If it's an object, extract the reading
    return data?.reading || data?.response || data || "The stars are being shy right now. Try again? ✨";
  } catch (error) {
    console.error('Chat error:', error);
    return "Hmm, the cosmic connection flickered for a moment. Let's try that again! 🌙";
  }
}

// Get daily horoscope with human personality
export async function getDailyReading(zodiacSign: string, intent?: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-reading', {
      body: {
        type: 'daily',
        zodiacSign,
        intent,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Daily reading error:', error);
    // Return a human fallback
    return {
      theme: "Cosmic Reset Day",
      reading: `Hey ${zodiacSign}! Even when the cosmic wifi is spotty, your inner light stays bright. ✨ Today's a good day for small wins - celebrate the little things!`,
      energy: 70,
      do: "Trust your intuition",
      avoid: "Overthinking",
      luckyColor: "Purple",
      luckyNumber: 7,
      luckyTime: "2:22 PM",
    };
  }
}

// Get compatibility reading
export async function getCompatibility(sign1: string, sign2: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-reading', {
      body: {
        type: 'compatibility',
        zodiacSign: `${sign1} and ${sign2}`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Compatibility error:', error);
    return {
      score: 75,
      summary: `${sign1} and ${sign2}? Now that's an interesting cosmic cocktail! ✨`,
      strengths: ["Natural chemistry", "Complementary energies"],
      challenges: ["Different communication styles", "Need for patience"],
      advice: "Focus on understanding each other's love language.",
    };
  }
}

// Generate any type of reading
export async function generateReading(request: ReadingRequest): Promise<any> {
  const { type, zodiacSign, question, intent, userName } = request;
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-reading', {
      body: {
        type,
        zodiacSign,
        question,
        intent,
        userName,
        mood: question ? detectMood(question) : 'neutral',
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Reading error:', error);
    throw error;
  }
}
