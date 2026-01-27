import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { BedrockRuntimeClient, InvokeModelCommand } from "npm:@aws-sdk/client-bedrock-runtime";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: Deno.env.get('AWS_REGION') || 'us-east-1',
  credentials: {
    accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
    secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY') || '',
  },
});

interface ReadingRequest {
  type: 'daily' | 'love' | 'career' | 'question' | 'detailed';
  zodiacSign: string;
  question?: string;
  intent?: string;
}

function buildPrompt(request: ReadingRequest): string {
  const { type, zodiacSign, question, intent } = request;
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const systemPrompt = `You are Veya, a wise and compassionate cosmic guide. Provide personalized astrological insights that are:
- Specific and actionable, not generic
- Balanced between mystical and practical
- Encouraging but honest
- 3-4 sentences for daily, longer for detailed

Always respond with valid JSON only, no markdown.`;

  let userPrompt = '';

  switch (type) {
    case 'daily':
      userPrompt = `Generate a daily horoscope for ${zodiacSign} for ${today}.
Focus: ${intent || 'general wellbeing'}
Return JSON: {"theme":"string","reading":"string","energy":number(1-100),"do":"string","avoid":"string","luckyColor":"string","luckyNumber":number(1-9),"luckyTime":"string"}`;
      break;

    case 'love':
      userPrompt = `Love reading for ${zodiacSign} on ${today}.
Return JSON: {"reading":"string","advice":"string","energy":number(1-100)}`;
      break;

    case 'career':
      userPrompt = `Career/finance reading for ${zodiacSign} on ${today}.
Return JSON: {"reading":"string","advice":"string","energy":number(1-100)}`;
      break;

    case 'question':
      userPrompt = `A ${zodiacSign} asks: "${question}"
Provide cosmic guidance. Return JSON: {"reading":"string","advice":"string"}`;
      break;

    case 'detailed':
      userPrompt = `Weekly reading for ${zodiacSign}.
Return JSON: {"theme":"string","love":"string","career":"string","health":"string","spiritual":"string","advice":"string"}`;
      break;

    default:
      userPrompt = `Inspirational message for ${zodiacSign}. Return JSON: {"reading":"string"}`;
  }

  return JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      { role: "user", content: userPrompt }
    ]
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const request: ReadingRequest = await req.json();

    // Call Claude via Bedrock
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0', // Fast & cheap for readings
      contentType: 'application/json',
      accept: 'application/json',
      body: buildPrompt(request),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract the text content
    const content = responseBody.content?.[0]?.text || '{}';
    
    // Parse the JSON from Claude's response
    let reading;
    try {
      reading = JSON.parse(content);
    } catch {
      // If JSON parsing fails, wrap in reading object
      reading = { reading: content };
    }

    return new Response(JSON.stringify(reading), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Fallback response
    return new Response(JSON.stringify({
      reading: "The cosmic energies are strong today. Trust your intuition and stay open to unexpected opportunities.",
      energy: 75,
      luckyColor: "Purple",
      luckyNumber: 7,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
