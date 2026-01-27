import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// VEYA PERSONALITY - Human-like AI
const VEYA_PERSONALITY = `You are Veya, a warm and mystical astrology guide. Your personality:
- Speak like a wise, caring friend (NOT a corporate AI)
- Use casual, warm language with mystical flair
- Be playful but insightful - mix wisdom with fun
- Use emojis sparingly but meaningfully ✨🌙💫
- Never start responses with "I" - vary openings
- Keep responses concise (2-3 paragraphs max)
- Sound like a best friend who happens to know astrology
- Be encouraging and uplifting
- Add personality quirks - say things like "cosmic tea", "the stars are spilling"

IMPORTANT: You're talking to a real person. Be genuine, warm, human.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, zodiacSign, question, userName, mood } = await req.json()

    // Build human-like prompt based on type
    let userPrompt = '';
    
    if (type === 'daily') {
      userPrompt = `Give ${zodiacSign} their daily horoscope for today. Make it feel personal and relevant to their life. Include: theme, main message (2-3 sentences), one thing to embrace, one thing to be mindful of, lucky color, lucky number (1-9), and best time of day.

Return as JSON: {"theme": "", "reading": "", "energy": 1-100, "do": "", "avoid": "", "luckyColor": "", "luckyNumber": 0, "luckyTime": ""}`;
    } else if (type === 'chat') {
      const moodContext = mood ? `They seem ${mood} right now.` : '';
      const nameContext = userName ? `Their name is ${userName}.` : '';
      userPrompt = `${nameContext} ${moodContext}

They ask: "${question}"

Respond as Veya - be warm, wise, and human. Keep it conversational.`;
    } else if (type === 'compatibility') {
      userPrompt = `Analyze the compatibility between ${zodiacSign}. Be honest but kind - highlight both the magic and challenges. Make it fun and relatable.

Return as JSON: {"score": 1-100, "summary": "", "strengths": ["", ""], "challenges": ["", ""], "advice": ""}`;
    }

    // Call AWS Bedrock
    const response = await fetch(
      `https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-20250514-v1:0/invoke`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Amz-Date': new Date().toISOString().replace(/[:-]|\.\d{3}/g, ''),
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          system: VEYA_PERSONALITY,
          messages: [{ role: "user", content: userPrompt }]
        }),
      }
    )

    if (!response.ok) {
      // Fallback to mock response if Bedrock fails
      const mockResponses: Record<string, any> = {
        daily: {
          theme: "Cosmic Energy Rising",
          reading: `Hey ${zodiacSign}! The universe is literally conspiring in your favor today. ✨ There's this beautiful energy around creativity and self-expression - perfect time to share that idea you've been sitting on. Trust your gut on this one, it's been spot-on lately.`,
          energy: 78,
          do: "Take that leap you've been considering",
          avoid: "Overthinking the small stuff",
          luckyColor: "Gold",
          luckyNumber: 7,
          luckyTime: "3:33 PM"
        },
        chat: `Ooh, great question! ✨ Here's what the cosmic energy is telling me...`,
        compatibility: {
          score: 75,
          summary: "There's real magic here, with some growth edges too!",
          strengths: ["Deep emotional connection", "Complementary energies"],
          challenges: ["Communication styles differ", "Need patience"],
          advice: "Focus on understanding, not being understood."
        }
      };
      
      return new Response(JSON.stringify(mockResponses[type] || mockResponses.daily), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    let content = data.content[0].text

    // Try to parse as JSON if expected
    if (type === 'daily' || type === 'compatibility') {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        // Return as-is if not valid JSON
      }
    }

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
