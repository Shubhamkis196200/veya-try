// AI-powered horoscope and reading generation
// Uses edge function or direct API call

const SYSTEM_PROMPT = `You are Veya, a wise and compassionate cosmic guide. You provide personalized astrological insights with warmth and depth. Your readings are:
- Specific and actionable, not generic
- Balanced between mystical language and practical advice  
- Encouraging but honest about challenges
- Around 3-4 sentences for daily readings, longer for detailed readings

Always reference the user's zodiac sign and current cosmic events when relevant.`;

interface ReadingRequest {
  type: 'daily' | 'love' | 'career' | 'detailed' | 'question';
  zodiacSign: string;
  question?: string;
  birthDate?: string;
  intent?: string;
}

interface ReadingResponse {
  reading: string;
  luckyNumber?: number;
  luckyColor?: string;
  luckyTime?: string;
  energy?: number;
  advice?: string;
}

// Generate reading prompt based on type
function generatePrompt(request: ReadingRequest): string {
  const { type, zodiacSign, question, intent } = request;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  switch (type) {
    case 'daily':
      return `Generate a daily horoscope for ${zodiacSign} for ${today}. 
Focus area: ${intent || 'general wellbeing'}
Include: theme of the day, energy level (1-100), one do and one avoid, lucky color and number.
Format as JSON: { "theme": "", "reading": "", "energy": number, "do": "", "avoid": "", "luckyColor": "", "luckyNumber": number }`;

    case 'love':
      return `Generate a love and relationship reading for ${zodiacSign} for ${today}.
Be specific about romantic energy, communication, and connection opportunities.
Format as JSON: { "reading": "", "advice": "", "energy": number }`;

    case 'career':
      return `Generate a career and finance reading for ${zodiacSign} for ${today}.
Focus on professional opportunities, financial decisions, and work relationships.
Format as JSON: { "reading": "", "advice": "", "energy": number }`;

    case 'question':
      return `A ${zodiacSign} asks: "${question}"
Provide cosmic guidance answering their question with astrological insight.
Be specific and helpful. Format as JSON: { "reading": "", "advice": "" }`;

    case 'detailed':
      return `Generate a comprehensive weekly reading for ${zodiacSign}.
Include: overall theme, love, career, health, and spiritual growth sections.
Format as JSON: { "theme": "", "love": "", "career": "", "health": "", "spiritual": "", "weeklyAdvice": "" }`;

    default:
      return `Generate an inspirational cosmic message for ${zodiacSign}. Format as JSON: { "reading": "" }`;
  }
}

// Mock AI response for when API is not available
function getMockReading(request: ReadingRequest): ReadingResponse {
  const readings: Record<string, string[]> = {
    daily: [
      `The stars align in your favor today, ${request.zodiacSign}. Your natural intuition is heightened - trust those gut feelings, especially in matters close to your heart. A conversation later today could open unexpected doors.`,
      `Today brings a wave of creative energy, ${request.zodiacSign}. Channel it into projects that matter to you. The universe supports bold moves, but remember to pace yourself. Evening hours favor reflection.`,
      `${request.zodiacSign}, the cosmos encourages you to slow down and listen. Important insights come through stillness today. A small act of kindness could create ripples you won't see until later.`,
    ],
    love: [
      `Venus smiles on your romantic sector today. If single, stay open to connections in unexpected places. If partnered, express appreciation openly - your words carry extra weight now.`,
      `Emotional depths are accessible today. This is ideal for meaningful conversations about feelings and future dreams. Vulnerability is your superpower right now.`,
    ],
    career: [
      `Professional momentum builds today. Your ideas have more impact than usual - share them confidently. A mentor figure may offer valuable guidance. Financial decisions favor caution over risk.`,
      `Collaboration unlocks opportunities today. Reach out to colleagues or partners you've been meaning to connect with. Your network is your net worth right now.`,
    ],
  };

  const typeReadings = readings[request.type] || readings.daily;
  const reading = typeReadings[Math.floor(Math.random() * typeReadings.length)];

  return {
    reading,
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    luckyColor: ['Gold', 'Purple', 'Blue', 'Green', 'Silver', 'Rose'][Math.floor(Math.random() * 6)],
    luckyTime: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'][Math.floor(Math.random() * 5)],
    energy: 60 + Math.floor(Math.random() * 35),
    advice: 'Trust your intuition and stay open to the universe\'s guidance.',
  };
}

// Main function to get AI reading
export async function getAIReading(request: ReadingRequest): Promise<ReadingResponse> {
  try {
    // Try Supabase Edge Function first (you can deploy this later)
    const response = await fetch('https://ennlryjggdoljgbqhttb.supabase.co/functions/v1/generate-reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubmxyeWpnZ2RvbGpnYnFodHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Nzg3ODMsImV4cCI6MjA4NTA1NDc4M30.FOlCuYFogxXTdvgUTMw7Em4-dn2ANRRAHdf6WeJi3yY`,
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // Fall back to mock if edge function not deployed
    throw new Error('Edge function not available');
  } catch (error) {
    // Return mock reading as fallback
    return getMockReading(request);
  }
}

// Generate daily insight with all components
export async function generateDailyInsight(zodiacSign: string, intent?: string) {
  const reading = await getAIReading({
    type: 'daily',
    zodiacSign,
    intent,
  });

  return {
    theme: 'Cosmic Clarity',
    energy_summary: reading.reading,
    do_list: ['Trust your intuition', 'Connect with loved ones', 'Take inspired action'],
    avoid_list: ['Overthinking', 'Rushing decisions'],
    lucky_color: reading.luckyColor || 'Gold',
    lucky_number: reading.luckyNumber || 7,
    lucky_time: reading.luckyTime || '3 PM',
    energy_level: reading.energy || 75,
    advice: reading.advice,
  };
}

// Chat with Veya AI
export async function chatWithVeya(message: string, zodiacSign: string, context?: string): Promise<string> {
  const reading = await getAIReading({
    type: 'question',
    zodiacSign,
    question: message,
  });

  return reading.reading;
}

export default {
  getAIReading,
  generateDailyInsight,
  chatWithVeya,
};
