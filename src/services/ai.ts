/**
 * SIMPLE AI SERVICE
 * Direct call to Supabase Edge Function → AWS Bedrock
 */

const SUPABASE_URL = 'https://ennlryjggdoljgbqhttb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubmxyeWpnZ2RvbGpnYnFodHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Nzg3ODMsImV4cCI6MjA4NTA1NDc4M30.FOlCuYFogxXTdvgUTMw7Em4-dn2ANRRAHdf6WeJi3yY';

export interface ChatResponse {
  response: string;
  error?: string;
}

export async function sendMessage(
  message: string, 
  userName?: string,
  sunSign?: string
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        message,
        userData: {
          name: userName || 'friend',
          sunSign: sunSign || 'Aries',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('AI service error');
    }

    const data = await response.json();
    return { response: data.response || 'The stars are quiet right now...' };
  } catch (error) {
    console.error('Chat error:', error);
    return { 
      response: 'Unable to connect to the cosmos. Please try again.',
      error: String(error)
    };
  }
}

export async function getDailyReading(sunSign: string, intent?: string) {
  const readings: Record<string, string> = {
    Aries: "Bold energy surrounds you today. Take initiative!",
    Taurus: "Stability is your strength. Trust your grounded nature.",
    Gemini: "Communication flows easily. Share your ideas!",
    Cancer: "Nurture yourself today. Home brings comfort.",
    Leo: "Your confidence shines bright. Lead with heart!",
    Virgo: "Details matter today. Your precision pays off.",
    Libra: "Balance is key. Harmony in relationships awaits.",
    Scorpio: "Deep insights emerge. Trust your intuition.",
    Sagittarius: "Adventure calls! Expand your horizons.",
    Capricorn: "Your ambition drives success. Stay focused.",
    Aquarius: "Innovation sparks! Think outside the box.",
    Pisces: "Dreams hold meaning. Let creativity flow.",
  };

  const intentMessages: Record<string, string> = {
    love: " Love is in the air today.",
    career: " Career opportunities emerge.",
    growth: " Personal growth is highlighted.",
    wealth: " Financial matters look favorable.",
  };

  const baseReading = readings[sunSign] || readings.Aries;
  const intentBonus = intent ? (intentMessages[intent] || '') : '';

  return {
    sign: sunSign,
    reading: baseReading + intentBonus,
    energy: 70 + Math.floor(Math.random() * 25),
    mood: 'optimistic',
    lucky_number: Math.floor(Math.random() * 100),
  };
}
