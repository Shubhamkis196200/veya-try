import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
}

function getMoonPhase() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  let jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day - 1524.5
  const age = ((jd - 2451550.1) % 29.530588853 + 29.530588853) % 29.530588853
  const illumination = Math.round((1 - Math.cos(age * 2 * Math.PI / 29.530588853)) * 50)
  let phase = 'Waxing Crescent', energy = 'building momentum'
  if (age < 1.85) { phase = 'New Moon'; energy = 'new beginnings' }
  else if (age < 7.38) { phase = 'Waxing Crescent'; energy = 'taking action' }
  else if (age < 14.77) { phase = 'Waxing Gibbous'; energy = 'refining' }
  else if (age < 16.61) { phase = 'Full Moon'; energy = 'culmination' }
  else if (age < 22.15) { phase = 'Waning Gibbous'; energy = 'gratitude' }
  else { phase = 'Waning Crescent'; energy = 'rest, reflection' }
  return { phase, illumination, energy }
}

function getPlanets() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  return {
    Sun: signs[Math.floor((day + 10) / 30.44) % 12],
    Moon: signs[Math.floor((day * 13.4) / 2.5) % 12],
    Venus: signs[Math.floor((day * 1.6 + 120) / 30) % 12],
    Mars: signs[Math.floor((day * 0.53 + 200) / 30) % 12],
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { message, userData } = await req.json()
    const PERPLEXITY_KEY = Deno.env.get('PERPLEXITY_API_KEY')
    if (!PERPLEXITY_KEY) throw new Error('API key not configured')

    const moon = getMoonPhase()
    const planets = getPlanets()
    const sign = userData?.sunSign || 'Aries'
    const signData = ZODIAC[sign] || ZODIAC.Aries
    const name = userData?.name || 'friend'

    const systemPrompt = `You are Veya, a wise AI astrologer. Give personalized guidance.

COSMIC WEATHER: Moon ${moon.phase} (${moon.illumination}%), Sun in ${planets.Sun}, Venus in ${planets.Venus}

USER: ${name}, Sun in ${sign} (${signData.traits}), Moon ${userData?.moonSign || '?'}, Rising ${userData?.risingSign || '?'}, Born ${userData?.birthDate || '?'}

RULES: Use their name/sign, reference planets, be specific & warm, 2-3 paragraphs.`

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${PERPLEXITY_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
        max_tokens: 500, temperature: 0.7,
      }),
    })

    if (!response.ok) throw new Error('AI service error')
    const data = await response.json()

    return new Response(JSON.stringify({ response: data.choices?.[0]?.message?.content, moon, planets }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
