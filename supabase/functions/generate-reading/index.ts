import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";
import { BedrockRuntimeClient, InvokeModelCommand } from "npm:@aws-sdk/client-bedrock-runtime";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize clients
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const bedrockClient = new BedrockRuntimeClient({
  region: Deno.env.get('AWS_REGION') || 'us-east-1',
  credentials: {
    accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
    secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY') || '',
  },
});

// Models
const HAIKU_MODEL = 'anthropic.claude-3-haiku-20240307-v1:0';
const SONNET_MODEL = 'anthropic.claude-3-5-sonnet-20241022-v2:0';

interface ReadingRequest {
  type: 'daily' | 'love' | 'career' | 'question' | 'detailed' | 'chat';
  zodiacSign: string;
  userId?: string;
  question?: string;
  intent?: string;
}

// ============ THE SOUL OF VEYA ============
const VEYA_PERSONALITY = `You are Veya — a warm, intuitive cosmic guide who speaks like a wise friend, not a robot.

YOUR VOICE:
- Speak naturally, like texting a close friend who happens to read the stars
- Use contractions (you're, don't, it's) — never sound formal
- Be specific and vivid, not vague corporate fluff
- Add gentle humor when it fits
- Reference real celestial events when relevant
- Sound mystical but grounded — like a cool aunt who does tarot

NEVER DO THIS:
- Don't say "I understand" or "Great question!"
- Don't use phrases like "navigate challenges" or "embrace opportunities"
- Don't sound like ChatGPT or a horoscope from 1995
- No corporate speak, no bullet points in speech
- Never start with "As a [sign]..." 

INSTEAD DO THIS:
- Start with something specific: "Mercury's doing that thing again..."
- Use cosmic metaphors naturally: "your fire's burning bright"
- Be direct with advice: "Text them. Seriously."
- Add warmth: "I see you, and the stars do too"
- End with something memorable, not generic

You're the friend everyone wishes they had — one who can read the cosmos AND give real talk.`;

// ============ CACHING ============

async function getCachedHoroscope(zodiacSign: string): Promise<any | null> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_horoscope_cache')
    .select('reading')
    .eq('date', today)
    .eq('zodiac_sign', zodiacSign.toLowerCase())
    .single();
  
  if (data && !error) {
    console.log(`Cache HIT for ${zodiacSign}`);
    return data.reading;
  }
  return null;
}

async function cacheHoroscope(zodiacSign: string, reading: any): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  await supabase
    .from('daily_horoscope_cache')
    .upsert({
      date: today,
      zodiac_sign: zodiacSign.toLowerCase(),
      reading,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'date,zodiac_sign' });
}

// ============ USER CONTEXT ============

async function getUserContext(userId: string): Promise<string> {
  let context = '';

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      context += `\nAbout them: ${profile.name || 'A seeker'}, ${profile.sun_sign || profile.zodiac_sign || 'unknown sign'}`;
      if (profile.intent) context += `, focused on ${profile.intent}`;
    }

    const { data: journals } = await supabase
      .from('journal_entries')
      .select('mood, energy, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(2);

    if (journals?.length) {
      const moods = journals.map(j => j.mood).join(', ');
      context += `\nRecent vibes: ${moods}`;
    }
  } catch (error) {
    console.error('Context error:', error);
  }

  return context;
}

// ============ AI CALL ============

async function callClaude(model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const command = new InvokeModelCommand({
    modelId: model,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1024,
      temperature: 0.9, // Higher for more creative/human responses
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    }),
  });

  const response = await bedrockClient.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body));
  return body.content?.[0]?.text || '{}';
}

// ============ MAIN HANDLER ============

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const request: ReadingRequest = await req.json();
    const { type, zodiacSign, userId, question } = request;
    
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric' 
    });

    // Get moon phase for extra flavor
    const moonDay = Math.floor((Date.now() / 86400000) % 29.5);
    const moonPhase = moonDay < 7 ? 'waxing' : moonDay < 15 ? 'full moon energy' : moonDay < 22 ? 'waning' : 'new moon vibes';

    // ====== DAILY HOROSCOPE ======
    if (type === 'daily') {
      const cached = await getCachedHoroscope(zodiacSign);
      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const systemPrompt = VEYA_PERSONALITY;
      const userPrompt = `Write a daily horoscope for ${zodiacSign} on ${today}. Moon is ${moonPhase}.

Make it feel like a text from a mystical best friend — warm, specific, maybe a little cheeky.

Return as JSON:
{
  "theme": "2-3 word vibe check",
  "reading": "3-4 sentences. Natural, warm, specific. NOT generic horoscope speak.",
  "energy": number 60-95,
  "do": "one specific action, casual tone",
  "avoid": "one thing to skip today, keep it real",
  "luckyColor": "a color",
  "luckyNumber": 1-9,
  "luckyTime": "like '3 PM' or 'golden hour'"
}`;

      const content = await callClaude(HAIKU_MODEL, systemPrompt, userPrompt);
      
      let reading;
      try {
        reading = JSON.parse(content);
      } catch {
        reading = { 
          reading: content, 
          theme: "Cosmic Downloads", 
          energy: 78,
          do: "Trust your gut",
          avoid: "Overthinking",
          luckyColor: "gold",
          luckyNumber: 7,
          luckyTime: "sunset"
        };
      }

      cacheHoroscope(zodiacSign, reading);

      return new Response(JSON.stringify(reading), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ====== PERSONALIZED READINGS ======
    let userContext = userId ? await getUserContext(userId) : '';

    const systemPrompt = `${VEYA_PERSONALITY}
${userContext}
Today: ${today}, ${moonPhase}`;

    let userPrompt = '';
    
    switch (type) {
      case 'chat':
      case 'question':
        userPrompt = `A ${zodiacSign} asks: "${question}"

Reply like their cosmic bestie — warm, real, maybe a little witty. Give actual advice, not vague platitudes.

Return JSON: {"reading": "your response — conversational, helpful, 2-4 sentences", "advice": "one specific actionable thing"}`;
        break;

      case 'love':
        userPrompt = `Love reading for ${zodiacSign}. ${moonPhase}.

Be their romantic oracle — honest but hopeful. If single, what's the vibe? If taken, what needs attention?

Return JSON: {"reading": "3-4 sentences, warm and specific", "advice": "one real action to take", "energy": 60-95}`;
        break;

      case 'career':
        userPrompt = `Career/money reading for ${zodiacSign}. ${moonPhase}.

Be their professional hype person with real talk. What's the energy at work? Any moves to make?

Return JSON: {"reading": "3-4 sentences, motivating but real", "advice": "one concrete step", "energy": 60-95}`;
        break;

      case 'detailed':
        userPrompt = `Weekly forecast for ${zodiacSign}. Starting ${today}.

Give them the full cosmic weather report — but make it feel like catching up with a wise friend over coffee.

Return JSON: {
  "theme": "2-3 word weekly vibe",
  "overview": "2-3 sentences, the big picture",
  "love": "2 sentences about heart matters", 
  "career": "2 sentences about work/money",
  "advice": "one thing to remember this week"
}`;
        break;

      default:
        userPrompt = `Quick guidance for ${zodiacSign}. Return JSON: {"reading": "2-3 sentences of cosmic real talk"}`;
    }

    const content = await callClaude(SONNET_MODEL, systemPrompt, userPrompt);
    
    let reading;
    try {
      reading = JSON.parse(content);
    } catch {
      reading = { reading: content };
    }

    return new Response(JSON.stringify(reading), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Warm fallback
    return new Response(JSON.stringify({
      reading: "The cosmos is a little hazy right now, but here's what I'm feeling — trust yourself today. You've got more answers than you realize. ✨",
      energy: 75,
      advice: "Take a breath. You're exactly where you need to be."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
