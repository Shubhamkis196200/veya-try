import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { birthDate, birthTime, birthLocation } = await req.json()
    const PERPLEXITY_KEY = Deno.env.get('PERPLEXITY_API_KEY')
    if (!PERPLEXITY_KEY) throw new Error('API key not configured')

    const prompt = `Calculate the astrological birth chart for someone born on ${birthDate}${birthTime ? ' at ' + birthTime : ''}${birthLocation ? ' in ' + birthLocation : ''}.

Return ONLY a JSON object (no markdown, no explanation):
{"sun_sign":"","moon_sign":"","rising_sign":"","element":"","ruling_planet":"","personality":"2 sentences"}

If birth time unknown, estimate moon_sign and put "Unknown" for rising_sign.`

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + PERPLEXITY_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          { role: 'system', content: 'You are an astrologer. Return ONLY valid JSON, nothing else.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300, temperature: 0.2,
      }),
    })

    if (!response.ok) throw new Error('AI error')
    const data = await response.json()
    let content = data.choices?.[0]?.message?.content || '{}'
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const chart = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    
    return new Response(JSON.stringify({ success: true, chart }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
