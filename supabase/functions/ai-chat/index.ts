/**
 * AI Chat Edge Function - SIMPLE VERSION
 * Uses Perplexity API (already configured) - no complex AWS signing!
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, userData } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const PERPLEXITY_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!PERPLEXITY_KEY) {
      // Fallback to local response if no API key
      return new Response(
        JSON.stringify({ 
          response: getLocalResponse(message, userData) 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are Veya, a mystical and warm AI astrologer. 
The user's name is ${userData?.name || 'friend'} and their sun sign is ${userData?.sunSign || 'a mystery'}.
Give brief, insightful responses (2-3 sentences max). 
Sprinkle in astrological wisdom naturally. Be warm and encouraging.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity error:', errorText);
      return new Response(
        JSON.stringify({ response: getLocalResponse(message, userData) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || getLocalResponse(message, userData);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        response: 'The stars are aligning... Please try again in a moment. ✨'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Local fallback responses
function getLocalResponse(message: string, userData: any): string {
  const name = userData?.name || 'friend';
  const sign = userData?.sunSign || 'star child';
  
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('love') || lowerMsg.includes('relationship')) {
    return `${name}, as a ${sign}, your heart is opening to new possibilities. Trust the cosmic timing of love. 💜`;
  }
  if (lowerMsg.includes('career') || lowerMsg.includes('work') || lowerMsg.includes('job')) {
    return `The stars show opportunity ahead, ${name}. Your ${sign} determination will guide you to success. 🌟`;
  }
  if (lowerMsg.includes('today') || lowerMsg.includes('day')) {
    return `Today holds magic for you, ${name}. As a ${sign}, embrace the unexpected gifts the universe sends. ✨`;
  }
  if (lowerMsg.includes('future') || lowerMsg.includes('ahead')) {
    return `The cosmos is weaving beautiful patterns for you, ${name}. Your ${sign} intuition will light the path. 🔮`;
  }
  
  return `${name}, the universe hears your question. As a ${sign}, trust your inner wisdom - the answers are already within you. 💫`;
}
