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

// Models - Haiku for cached/simple, Sonnet for personalized
const HAIKU_MODEL = 'anthropic.claude-3-haiku-20240307-v1:0';
const SONNET_MODEL = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
const EMBEDDING_MODEL = 'amazon.titan-embed-text-v2:0';

interface ReadingRequest {
  type: 'daily' | 'love' | 'career' | 'question' | 'detailed' | 'chat';
  zodiacSign: string;
  userId?: string;
  question?: string;
  intent?: string;
}

// ============ CACHING SYSTEM ============

// Check cache for daily horoscope
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
  
  console.log(`Cache MISS for ${zodiacSign}`);
  return null;
}

// Save to cache
async function cacheHoroscope(zodiacSign: string, reading: any): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  await supabase
    .from('daily_horoscope_cache')
    .upsert({
      date: today,
      zodiac_sign: zodiacSign.toLowerCase(),
      reading,
    }, {
      onConflict: 'date,zodiac_sign'
    });
  
  console.log(`Cached horoscope for ${zodiacSign}`);
}

// ============ EMBEDDING FOR RAG ============

async function getEmbedding(text: string): Promise<number[]> {
  try {
    const command = new InvokeModelCommand({
      modelId: EMBEDDING_MODEL,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        inputText: text,
        dimensions: 1536,
        normalize: true,
      }),
    });

    const response = await bedrockClient.send(command);
    const body = JSON.parse(new TextDecoder().decode(response.body));
    return body.embedding;
  } catch (error) {
    console.error('Embedding error:', error);
    return [];
  }
}

// ============ USER CONTEXT (RAG) ============

async function getUserContext(userId: string, question: string): Promise<string> {
  let context = '';

  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      context += `\n## User Profile:
- Name: ${profile.name || 'Friend'}
- Sun Sign: ${profile.sun_sign || profile.zodiac_sign || 'Unknown'}
- Birth Date: ${profile.birth_date || 'Unknown'}
- Focus: ${profile.intent || 'General'}`;
    }

    // Get recent journal entries
    const { data: journals } = await supabase
      .from('journal_entries')
      .select('mood, energy, gratitude, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (journals?.length) {
      context += `\n## Recent Mood:`;
      journals.forEach((j, i) => {
        context += `\n- ${j.mood} (energy: ${j.energy}/10)`;
      });
    }

    // RAG: Search similar past readings
    if (question) {
      const embedding = await getEmbedding(question);
      
      if (embedding.length > 0) {
        const { data: similar } = await supabase
          .rpc('search_reading_history', {
            query_embedding: embedding,
            match_user_id: userId,
            match_count: 2
          });

        if (similar?.length) {
          context += `\n## Past Readings:`;
          similar.forEach((r: any) => {
            context += `\n- Q: "${r.question?.substring(0, 50)}..."`;
          });
        }
      }
    }
  } catch (error) {
    console.error('Context error:', error);
  }

  return context;
}

// ============ SAVE HISTORY ============

async function saveToHistory(userId: string, type: string, question: string, response: string) {
  try {
    const embedding = await getEmbedding(`${question} ${response}`);
    
    await supabase.from('reading_history').insert({
      user_id: userId,
      type,
      question,
      response,
      embedding: embedding.length > 0 ? embedding : null,
    });
  } catch (error) {
    console.error('Save error:', error);
  }
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
      temperature: 0.8,
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
    const { type, zodiacSign, userId, question, intent } = request;
    
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric' 
    });

    // ====== DAILY HOROSCOPE (CACHED) ======
    if (type === 'daily') {
      // Check cache first
      const cached = await getCachedHoroscope(zodiacSign);
      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate new (uses cheap Haiku model)
      const systemPrompt = `You are Veya, a cosmic guide. Generate a daily horoscope. Be specific and inspiring. JSON only.`;
      const userPrompt = `Daily horoscope for ${zodiacSign} on ${today}.
Return JSON: {"theme":"string","reading":"string (3-4 sentences)","energy":number(60-95),"do":"string","avoid":"string","luckyColor":"string","luckyNumber":number(1-9),"luckyTime":"string like 3 PM"}`;

      const content = await callClaude(HAIKU_MODEL, systemPrompt, userPrompt);
      
      let reading;
      try {
        reading = JSON.parse(content);
      } catch {
        reading = { reading: content, theme: "Cosmic Energy", energy: 75 };
      }

      // Cache it (async)
      cacheHoroscope(zodiacSign, reading);

      return new Response(JSON.stringify(reading), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ====== PERSONALIZED (USES SONNET + RAG) ======
    let userContext = '';
    if (userId) {
      userContext = await getUserContext(userId, question || '');
    }

    const systemPrompt = `You are Veya, a wise cosmic guide. Provide personalized guidance.
${userContext}
Today: ${today}. Be warm, specific, helpful. JSON only.`;

    let userPrompt = '';
    
    switch (type) {
      case 'chat':
      case 'question':
        userPrompt = `User (${zodiacSign}) asks: "${question}"
Return JSON: {"reading":"string","advice":"string"}`;
        break;
      case 'love':
        userPrompt = `Love reading for ${zodiacSign}. Return JSON: {"reading":"string","advice":"string","energy":number}`;
        break;
      case 'career':
        userPrompt = `Career reading for ${zodiacSign}. Return JSON: {"reading":"string","advice":"string","energy":number}`;
        break;
      case 'detailed':
        userPrompt = `Weekly reading for ${zodiacSign}. Return JSON: {"theme":"string","overview":"string","love":"string","career":"string","advice":"string"}`;
        break;
      default:
        userPrompt = `Guidance for ${zodiacSign}. Return JSON: {"reading":"string"}`;
    }

    const content = await callClaude(SONNET_MODEL, systemPrompt, userPrompt);
    
    let reading;
    try {
      reading = JSON.parse(content);
    } catch {
      reading = { reading: content };
    }

    // Save to history (async)
    if (userId) {
      saveToHistory(userId, type, question || '', reading.reading || content);
    }

    return new Response(JSON.stringify(reading), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    
    return new Response(JSON.stringify({
      reading: "The stars align in your favor. Trust your path today.",
      energy: 75,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
