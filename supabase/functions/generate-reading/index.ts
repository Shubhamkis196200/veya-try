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

// Model selection - Claude 3.5 Sonnet for best quality/cost balance
const MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
const EMBEDDING_MODEL = 'amazon.titan-embed-text-v2:0';

interface ReadingRequest {
  type: 'daily' | 'love' | 'career' | 'question' | 'detailed' | 'chat';
  zodiacSign: string;
  userId?: string;
  question?: string;
  intent?: string;
}

// Get embedding for text
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

// Fetch user context for RAG
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
- Name: ${profile.name || 'Unknown'}
- Sun Sign: ${profile.sun_sign || profile.zodiac_sign || 'Unknown'}
- Moon Sign: ${profile.moon_sign || 'Unknown'}
- Rising Sign: ${profile.rising_sign || 'Unknown'}
- Birth Date: ${profile.birth_date || 'Unknown'}
- Intent/Focus: ${profile.intent || 'General'}
`;
    }

    // Get recent journal entries
    const { data: journals } = await supabase
      .from('journal_entries')
      .select('mood, energy, gratitude, reflection, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (journals && journals.length > 0) {
      context += `\n## Recent Journal Entries:`;
      journals.forEach((j, i) => {
        context += `\n${i + 1}. Mood: ${j.mood}, Energy: ${j.energy}/10`;
        if (j.gratitude) context += `, Grateful for: ${j.gratitude}`;
      });
    }

    // Search similar past readings using embeddings
    if (question) {
      const embedding = await getEmbedding(question);
      
      if (embedding.length > 0) {
        const { data: similarReadings } = await supabase
          .rpc('search_reading_history', {
            query_embedding: embedding,
            match_user_id: userId,
            match_count: 2
          });

        if (similarReadings && similarReadings.length > 0) {
          context += `\n## Relevant Past Readings:`;
          similarReadings.forEach((r: any, i: number) => {
            context += `\n${i + 1}. Q: "${r.question}" → "${r.response?.substring(0, 150)}..."`;
          });
        }

        // Search user memories
        const { data: memories } = await supabase
          .rpc('search_user_memories', {
            query_embedding: embedding,
            match_user_id: userId,
            match_count: 3
          });

        if (memories && memories.length > 0) {
          context += `\n## User Memories:`;
          memories.forEach((m: any, i: number) => {
            context += `\n${i + 1}. [${m.type}] ${m.content}`;
          });
        }
      }
    }

  } catch (error) {
    console.error('Context fetch error:', error);
  }

  return context;
}

// Save reading to history for future RAG
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
    console.error('Save history error:', error);
  }
}

// Build the prompt with RAG context
function buildPrompt(request: ReadingRequest, userContext: string): string {
  const { type, zodiacSign, question, intent } = request;
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const systemPrompt = `You are Veya, a wise, warm, and insightful cosmic guide. You provide deeply personalized astrological guidance.

KEY BEHAVIORS:
- Remember and reference user's past readings and journal entries
- Notice patterns in their emotional journey
- Be specific, not generic - use their actual data
- Balance mystical wisdom with practical advice
- Be encouraging but honest about challenges
- Keep responses concise (3-5 sentences for quick readings)

TODAY: ${today}
${userContext}

Always respond with valid JSON only.`;

  let userPrompt = '';

  switch (type) {
    case 'daily':
      userPrompt = `Generate today's personalized horoscope for this ${zodiacSign}.
Consider their recent mood/energy from journal entries.
Focus area: ${intent || 'general wellbeing'}
Return JSON: {"theme":"string","reading":"string","energy":number(1-100),"do":"string","avoid":"string","luckyColor":"string","luckyNumber":number(1-9)}`;
      break;

    case 'chat':
    case 'question':
      userPrompt = `User asks: "${question}"

Provide personalized cosmic guidance. Reference their profile and history when relevant.
Return JSON: {"reading":"string","advice":"string","followUp":"string"}`;
      break;

    case 'love':
      userPrompt = `Love reading for ${zodiacSign}. Consider their emotional state from journals.
Return JSON: {"reading":"string","advice":"string","energy":number}`;
      break;

    case 'career':
      userPrompt = `Career guidance for ${zodiacSign}. 
Return JSON: {"reading":"string","advice":"string","energy":number}`;
      break;

    case 'detailed':
      userPrompt = `Comprehensive weekly reading for ${zodiacSign}. Reference their journey.
Return JSON: {"theme":"string","overview":"string","love":"string","career":"string","health":"string","advice":"string"}`;
      break;

    default:
      userPrompt = `Inspirational message for ${zodiacSign}. Return JSON: {"reading":"string"}`;
  }

  return JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1024,
    temperature: 0.8,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }]
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const request: ReadingRequest = await req.json();
    
    // Get user context for RAG (if userId provided)
    let userContext = '';
    if (request.userId) {
      userContext = await getUserContext(request.userId, request.question || '');
    }

    // Call Claude 3.5 Sonnet via Bedrock
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: buildPrompt(request, userContext),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const content = responseBody.content?.[0]?.text || '{}';
    
    let reading;
    try {
      reading = JSON.parse(content);
    } catch {
      reading = { reading: content };
    }

    // Save to history for future RAG (async, don't wait)
    if (request.userId) {
      saveToHistory(request.userId, request.type, request.question || '', reading.reading || content);
    }

    return new Response(JSON.stringify(reading), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    
    return new Response(JSON.stringify({
      reading: "The cosmic energies are aligning for you. Trust your intuition today.",
      energy: 75,
      error: true,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
