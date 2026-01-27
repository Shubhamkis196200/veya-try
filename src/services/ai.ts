/**
 * AI SERVICE - USING SUPABASE EDGE FUNCTION
 */
import { supabase } from '../lib/supabase';

const SUPABASE_URL = 'https://ennlryjggdoljgbqhttb.supabase.co';

// Zodiac data for fallback
const ZODIAC: Record<string, { element: string; ruler: string; traits: string }> = {
  Aries: { element: 'fire', ruler: 'Mars', traits: 'bold, ambitious, passionate' },
  Taurus: { element: 'earth', ruler: 'Venus', traits: 'reliable, patient, sensual' },
  Gemini: { element: 'air', ruler: 'Mercury', traits: 'curious, adaptable, witty' },
  Cancer: { element: 'water', ruler: 'Moon', traits: 'nurturing, intuitive, protective' },
  Leo: { element: 'fire', ruler: 'Sun', traits: 'confident, dramatic, generous' },
  Virgo: { element: 'earth', ruler: 'Mercury', traits: 'analytical, practical, helpful' },
  Libra: { element: 'air', ruler: 'Venus', traits: 'diplomatic, graceful, romantic' },
  Scorpio: { element: 'water', ruler: 'Pluto', traits: 'intense, mysterious, passionate' },
  Sagittarius: { element: 'fire', ruler: 'Jupiter', traits: 'adventurous, optimistic, free' },
  Capricorn: { element: 'earth', ruler: 'Saturn', traits: 'disciplined, ambitious, wise' },
  Aquarius: { element: 'air', ruler: 'Uranus', traits: 'innovative, humanitarian, unique' },
  Pisces: { element: 'water', ruler: 'Neptune', traits: 'dreamy, compassionate, artistic' },
};

function getMoonPhase() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  let jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day - 1524.5;
  const age = ((jd - 2451550.1) % 29.530588853 + 29.530588853) % 29.530588853;
  const illumination = Math.round((1 - Math.cos(age * 2 * Math.PI / 29.530588853)) * 50);
  let phase = 'Waxing Crescent', energy = 'building momentum';
  if (age < 1.85) { phase = 'New Moon'; energy = 'new beginnings'; }
  else if (age < 7.38) { phase = 'Waxing Crescent'; energy = 'taking action'; }
  else if (age < 14.77) { phase = 'Waxing Gibbous'; energy = 'refining'; }
  else if (age < 16.61) { phase = 'Full Moon'; energy = 'culmination'; }
  else if (age < 22.15) { phase = 'Waning Gibbous'; energy = 'gratitude'; }
  else { phase = 'Waning Crescent'; energy = 'rest, reflection'; }
  return { phase, illumination, energy };
}

// Main chat function - calls Edge Function
export async function chat(
  message: string,
  sign?: string,
  userName?: string,
  userData?: {
    birthDate?: string;
    birthTime?: string;
    birthLocation?: string;
    moonSign?: string;
    risingSign?: string;
    method?: string;
    intent?: string;
  }
): Promise<string> {
  const userSign = sign || 'Aries';
  const name = userName || 'friend';

  try {
    // Use correct anon key
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubmxyeWpnZ2RvbGpnYnFodHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Nzg3ODMsImV4cCI6MjA4NTA1NDc4M30.FOlCuYFogxXTdvgUTMw7Em4-dn2ANRRAHdf6WeJi3yY';
    
    // Call Edge Function with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        message,
        userData: {
          name,
          sunSign: userSign,
          moonSign: userData?.moonSign,
          risingSign: userData?.risingSign,
          birthDate: userData?.birthDate,
          birthTime: userData?.birthTime,
          birthLocation: userData?.birthLocation,
          method: userData?.method,
          intent: userData?.intent,
        },
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.response || generateFallback(message, name, userSign, userData);
  } catch (error) {
    console.error('Chat error:', error);
    return generateFallback(message, name, userSign, userData);
  }
}

function generateFallback(message: string, name: string, sign: string, userData?: any): string {
  const moon = getMoonPhase();
  const signData = ZODIAC[sign] || ZODIAC.Aries;
  const msg = message.toLowerCase();

  if (msg.includes('birth') || msg.includes('born') || msg.includes('date')) {
    if (userData?.birthDate) {
      return `🌟 ${name}, you were born on ${userData.birthDate}, making you a ${sign}!\n\n**Your Cosmic Blueprint:**\n☀️ Sun in ${sign} - ${signData.traits}\n🌙 Moon: ${userData?.moonSign || 'Unknown'}\n⬆️ Rising: ${userData?.risingSign || 'Unknown'}\n🔥 Element: ${signData.element}\n⭐ Ruler: ${signData.ruler}\n\nThe ${moon.phase} (${moon.illumination}%) amplifies your ${signData.element} energy today! ✨`;
    }
    return `🌟 ${name}, as a ${sign}, you're ruled by ${signData.ruler} and carry ${signData.element} energy!\n\nTraits: ${signData.traits}\n\nShare your birth date for a deeper reading! ✨`;
  }

  if (msg.includes('love') || msg.includes('relationship')) {
    return `💕 ${name}, under tonight's ${moon.phase} (${moon.illumination}%), your ${sign} heart seeks ${signData.element === 'fire' ? 'passionate adventure' : signData.element === 'earth' ? 'stable devotion' : signData.element === 'water' ? 'deep emotional bonds' : 'intellectual connection'}.\n\nAs a ${signData.traits.split(',')[0]} soul ruled by ${signData.ruler}, you attract through ${signData.element === 'fire' ? 'confidence and warmth' : signData.element === 'earth' ? 'reliability and sensuality' : signData.element === 'water' ? 'intuition and empathy' : 'wit and charm'}. Trust the cosmic timing! 💜`;
  }

  if (msg.includes('career') || msg.includes('work') || msg.includes('money')) {
    return `💼 ${name}, your ${sign} ambition is powered by ${signData.ruler}!\n\n**Career strengths:** ${signData.traits}\n**Element:** ${signData.element} - ${signData.element === 'fire' ? 'leadership & innovation' : signData.element === 'earth' ? 'building & managing' : signData.element === 'water' ? 'creativity & intuition' : 'ideas & networking'}\n\nThe ${moon.phase} suggests ${moon.illumination > 50 ? 'taking bold action' : 'strategic planning'}. Your ${signData.element} nature thrives when you trust your instincts! 🚀`;
  }

  if (msg.includes('today') || msg.includes('energy')) {
    const energy = 60 + Math.floor(moon.illumination / 3);
    return `✨ ${name}, today's energy for ${sign}:\n\n🌙 Moon: ${moon.phase} (${moon.illumination}%)\n💫 Energy Level: ${energy}%\n🔮 Mood: ${moon.energy}\n\nAs a ${signData.element} sign, you thrive when ${signData.element === 'fire' ? 'taking initiative' : signData.element === 'earth' ? 'building steadily' : signData.element === 'water' ? 'trusting intuition' : 'connecting with others'}. ${signData.ruler} guides you toward ${signData.traits.split(',')[0]} pursuits today! 🌟`;
  }

  return `✨ ${name}, I'm your cosmic guide under tonight's ${moon.phase}.\n\n**Your Profile:**\n☀️ Sun: ${sign} (${signData.traits})\n🔥 Element: ${signData.element}\n⭐ Ruler: ${signData.ruler}\n\nWhat would you like insight on?\n💕 Love & relationships\n💼 Career & money\n✨ Today's energy\n🔮 Your birth chart\n\nJust ask! 🌙`;
}

// Daily reading
export async function getDailyReading(sign: string, intent?: string) {
  const moon = getMoonPhase();
  const signData = ZODIAC[sign] || ZODIAC.Aries;
  const energy = 55 + Math.floor(moon.illumination / 2) + Math.floor(Math.random() * 20);

  return {
    sign,
    energy: Math.min(95, energy),
    insight: `The ${moon.phase} illuminates your ${signData.element} spirit, ${sign}. Your ruler ${signData.ruler} guides you toward ${signData.traits.split(',')[0]} pursuits today.`,
    details: `Moon ${moon.phase} at ${moon.illumination}%. ${moon.energy}.`,
    embrace: signData.element === 'fire' ? 'Bold action' : signData.element === 'earth' ? 'Steady progress' : signData.element === 'water' ? 'Trust intuition' : 'New connections',
    avoid: signData.element === 'fire' ? 'Impulsive decisions' : signData.element === 'earth' ? 'Stubbornness' : signData.element === 'water' ? 'Over-sensitivity' : 'Overthinking',
    moonPhase: moon.phase,
    moonSign: sign,
    luckyTime: `${9 + Math.floor(Math.random() * 8)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    tier: energy >= 85 ? 'Diamond' : energy >= 70 ? 'Gold' : energy >= 55 ? 'Silver' : 'Bronze',
  };
}

export async function getCompatibility(sign1: string, sign2: string) {
  const s1 = ZODIAC[sign1]?.element || 'fire';
  const s2 = ZODIAC[sign2]?.element || 'fire';
  const scores: Record<string, Record<string, number>> = {
    fire: { fire: 85, earth: 55, air: 92, water: 58 },
    earth: { fire: 55, earth: 88, air: 52, water: 95 },
    air: { fire: 92, earth: 52, air: 82, water: 62 },
    water: { fire: 58, earth: 95, air: 62, water: 88 },
  };
  return { sign1, sign2, score: (scores[s1]?.[s2] || 70) + Math.floor(Math.random() * 8) };
}

export default { chat, getDailyReading, getCompatibility };
