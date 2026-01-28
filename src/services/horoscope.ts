/**
 * SIMPLE HOROSCOPE SERVICE
 */

const ZODIAC_TRAITS: Record<string, { element: string; traits: string }> = {
  Aries: { element: 'fire', traits: 'bold, ambitious, passionate' },
  Taurus: { element: 'earth', traits: 'reliable, patient, sensual' },
  Gemini: { element: 'air', traits: 'curious, adaptable, witty' },
  Cancer: { element: 'water', traits: 'nurturing, intuitive, protective' },
  Leo: { element: 'fire', traits: 'confident, dramatic, generous' },
  Virgo: { element: 'earth', traits: 'analytical, practical, helpful' },
  Libra: { element: 'air', traits: 'diplomatic, graceful, romantic' },
  Scorpio: { element: 'water', traits: 'intense, mysterious, passionate' },
  Sagittarius: { element: 'fire', traits: 'adventurous, optimistic, free' },
  Capricorn: { element: 'earth', traits: 'disciplined, ambitious, wise' },
  Aquarius: { element: 'air', traits: 'innovative, humanitarian, unique' },
  Pisces: { element: 'water', traits: 'dreamy, compassionate, artistic' },
};

export function getDailyHoroscope(sign: string) {
  const data = ZODIAC_TRAITS[sign] || ZODIAC_TRAITS.Aries;
  return {
    sign,
    element: data.element,
    traits: data.traits,
    energy: 60 + Math.floor(Math.random() * 35),
    reading: `Today brings ${data.element} energy to your ${data.traits.split(',')[0]} nature.`,
  };
}

export function getCompatibility(sign1: string, sign2: string) {
  const e1 = ZODIAC_TRAITS[sign1]?.element || 'fire';
  const e2 = ZODIAC_TRAITS[sign2]?.element || 'fire';
  const scores: Record<string, Record<string, number>> = {
    fire: { fire: 85, earth: 55, air: 90, water: 60 },
    earth: { fire: 55, earth: 88, air: 50, water: 92 },
    air: { fire: 90, earth: 50, air: 82, water: 65 },
    water: { fire: 60, earth: 92, air: 65, water: 85 },
  };
  return { sign1, sign2, score: scores[e1]?.[e2] || 70 };
}
