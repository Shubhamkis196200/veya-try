/**
 * REAL HOROSCOPE DATA SERVICE
 * Generates readings based on actual planetary positions
 */
import { calculatePlanetPositions, getMoonPhase, type PlanetPosition } from '../lib/ephemeris';

// Helper to find planet by name
function findPlanet(planets: PlanetPosition[], name: string): PlanetPosition | undefined {
  return planets.find(p => p.planet.toLowerCase() === name.toLowerCase());
}

// Zodiac traits and rulerships
export const ZODIAC_DATA = {
  Aries: { element: 'fire', ruler: 'Mars', quality: 'cardinal', symbol: '♈' },
  Taurus: { element: 'earth', ruler: 'Venus', quality: 'fixed', symbol: '♉' },
  Gemini: { element: 'air', ruler: 'Mercury', quality: 'mutable', symbol: '♊' },
  Cancer: { element: 'water', ruler: 'Moon', quality: 'cardinal', symbol: '♋' },
  Leo: { element: 'fire', ruler: 'Sun', quality: 'fixed', symbol: '♌' },
  Virgo: { element: 'earth', ruler: 'Mercury', quality: 'mutable', symbol: '♍' },
  Libra: { element: 'air', ruler: 'Venus', quality: 'cardinal', symbol: '♎' },
  Scorpio: { element: 'water', ruler: 'Pluto', quality: 'fixed', symbol: '♏' },
  Sagittarius: { element: 'fire', ruler: 'Jupiter', quality: 'mutable', symbol: '♐' },
  Capricorn: { element: 'earth', ruler: 'Saturn', quality: 'cardinal', symbol: '♑' },
  Aquarius: { element: 'air', ruler: 'Uranus', quality: 'fixed', symbol: '♒' },
  Pisces: { element: 'water', ruler: 'Neptune', quality: 'mutable', symbol: '♓' },
};

const ASPECTS = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];

// Calculate cosmic energy based on planetary positions
export function calculateCosmicEnergy(sign: string, date: Date = new Date()): number {
  const planets = calculatePlanetPositions(date);
  const moon = getMoonPhase(date);
  const signData = ZODIAC_DATA[sign as keyof typeof ZODIAC_DATA];
  
  let energy = 50; // Base energy
  
  // Moon phase influence
  if (moon.phase === 'Full Moon') energy += 15;
  if (moon.phase === 'New Moon') energy += 10;
  if (moon.phase === 'Waxing Gibbous') energy += 8;
  
  // Ruler position bonus
  const rulerPlanet = findPlanet(planets, signData?.ruler || '');
  if (rulerPlanet) {
    // If ruler is in compatible sign
    const rulerSignData = ZODIAC_DATA[rulerPlanet.sign as keyof typeof ZODIAC_DATA];
    if (rulerSignData?.element === signData?.element) energy += 12;
  }
  
  // Sun position
  const sun = findPlanet(planets, 'Sun');
  if (sun?.sign === sign) energy += 20;
  
  // Day of week influence (planetary days)
  const dayRulers = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const todayRuler = dayRulers[date.getDay()];
  if (todayRuler === signData?.ruler) energy += 10;
  
  return Math.min(100, Math.max(30, energy + Math.floor(Math.random() * 15)));
}

// Generate daily reading based on real data
export function generateDailyReading(sign: string, date: Date = new Date()) {
  const planets = calculatePlanetPositions(date);
  const moon = getMoonPhase(date);
  const energy = calculateCosmicEnergy(sign, date);
  const signData = ZODIAC_DATA[sign as keyof typeof ZODIAC_DATA];
  
  const sun = findPlanet(planets, 'Sun');
  const currentMoon = findPlanet(planets, 'Moon');
  const mercury = findPlanet(planets, 'Mercury');
  const venus = findPlanet(planets, 'Venus');
  const mars = findPlanet(planets, 'Mars');
  
  // Generate insight based on actual positions
  const insights = generateInsights(sign, { sun, moon: currentMoon, mercury, venus, mars }, moon);
  const embrace = generateEmbrace(sign, planets, moon);
  const avoid = generateAvoid(sign, planets);
  
  return {
    sign,
    date: date.toISOString(),
    energy,
    moonPhase: moon.phase,
    moonSign: currentMoon?.sign || 'Unknown',
    planetaryHour: 'Sun', // Simplified
    sunSign: sun?.sign,
    mercurySign: mercury?.sign,
    venusSign: venus?.sign,
    marsSign: mars?.sign,
    insight: insights.main,
    details: insights.details,
    embrace,
    avoid,
    luckyTime: generateLuckyTime(sign, planets),
    luckyNumber: generateLuckyNumber(sign, date),
  };
}

function generateInsights(sign: string, planets: any, moon: any) {
  const signData = ZODIAC_DATA[sign as keyof typeof ZODIAC_DATA];
  const { sun, moon: currentMoon, mercury, venus, mars } = planets;
  
  // Build insight based on real positions
  const sunInSign = sun?.sign;
  const moonInSign = currentMoon?.sign;
  
  const mainInsights: Record<string, string[]> = {
    fire: [
      `With the Sun in ${sunInSign} and Moon in ${moonInSign}, your ${signData?.element} nature is amplified today.`,
      `The cosmic fire burns bright - ${moon.phase} energy fuels your ambitions.`,
      `Mars energy combines with ${moonInSign} Moon to ignite your passions.`,
    ],
    earth: [
      `Grounding energy from the ${moonInSign} Moon supports your practical ${sign} nature today.`,
      `${moon.phase} brings stability - perfect for ${sign}'s methodical approach.`,
      `Venus in ${venus?.sign || 'transit'} enhances your appreciation for life's pleasures.`,
    ],
    water: [
      `The ${moonInSign} Moon deepens your intuitive ${sign} abilities today.`,
      `${moon.phase} heightens emotional awareness - trust your feelings.`,
      `Cosmic waters run deep with the Moon illuminating hidden truths.`,
    ],
    air: [
      `Mercury in ${mercury?.sign || 'transit'} sharpens your ${sign} intellect today.`,
      `${moon.phase} stirs mental clarity - ideas flow freely under ${moonInSign} Moon.`,
      `Communication channels open wide with current planetary alignments.`,
    ],
  };
  
  const element = signData?.element || 'fire';
  const main = mainInsights[element][Math.floor(Math.random() * 3)];
  
  const details = `Today's ${moon.phase} in ${moonInSign} creates a ${
    element === 'fire' ? 'dynamic' : 
    element === 'earth' ? 'stabilizing' : 
    element === 'water' ? 'flowing' : 'stimulating'
  } atmosphere. With the Sun moving through ${sunInSign}, focus on ${
    element === 'fire' ? 'bold initiatives' : 
    element === 'earth' ? 'building foundations' : 
    element === 'water' ? 'emotional connections' : 'intellectual pursuits'
  }.`;
  
  return { main, details };
}

function generateEmbrace(sign: string, planets: any[], moon: any) {
  const embraceOptions: Record<string, string[]> = {
    Aries: ['Take bold action on your goals', 'Lead a new initiative', 'Express your authentic self'],
    Taurus: ['Invest in quality experiences', 'Ground yourself in nature', 'Trust your steady pace'],
    Gemini: ['Share your brilliant ideas', 'Connect with like-minded souls', 'Learn something new'],
    Cancer: ['Nurture important relationships', 'Trust your intuition', 'Create a cozy sanctuary'],
    Leo: ['Step into the spotlight', 'Express your creativity', 'Inspire others with your warmth'],
    Virgo: ['Organize your priorities', 'Offer helpful guidance', 'Perfect a meaningful skill'],
    Libra: ['Seek harmony in relationships', 'Appreciate beauty around you', 'Find balanced solutions'],
    Scorpio: ['Dive deep into passions', 'Transform what no longer serves', 'Trust your instincts'],
    Sagittarius: ['Expand your horizons', 'Share your wisdom', 'Embrace adventure'],
    Capricorn: ['Build toward long-term goals', 'Take on leadership', 'Honor your commitments'],
    Aquarius: ['Champion innovative ideas', 'Connect with your community', 'Embrace your uniqueness'],
    Pisces: ['Trust your creative vision', 'Practice compassion', 'Connect with spirituality'],
  };
  
  return embraceOptions[sign]?.[Math.floor(Math.random() * 3)] || 'Follow your heart';
}

function generateAvoid(sign: string, planets: any[]) {
  const avoidOptions: Record<string, string[]> = {
    Aries: ['Impulsive decisions without reflection', 'Unnecessary conflicts', 'Burning yourself out'],
    Taurus: ['Resisting necessary change', 'Overindulgence', 'Stubborn standoffs'],
    Gemini: ['Spreading yourself too thin', 'Superficial connections', 'Information overload'],
    Cancer: ['Taking things too personally', 'Retreating into your shell', 'Emotional manipulation'],
    Leo: ['Seeking external validation', 'Dominating conversations', 'Dramatic reactions'],
    Virgo: ['Perfectionist paralysis', 'Excessive criticism', 'Worrying about small details'],
    Libra: ['People-pleasing at your expense', 'Avoiding necessary conflict', 'Indecision'],
    Scorpio: ['Holding grudges', 'Power struggles', 'Obsessive thinking'],
    Sagittarius: ['Overcommitting', 'Blunt honesty that hurts', 'Restless impatience'],
    Capricorn: ['All work, no play', 'Pessimistic thinking', 'Rigid expectations'],
    Aquarius: ['Emotional detachment', 'Contrarian for its own sake', 'Neglecting close bonds'],
    Pisces: ['Escapist tendencies', 'Absorbing others\' emotions', 'Neglecting boundaries'],
  };
  
  return avoidOptions[sign]?.[Math.floor(Math.random() * 3)] || 'Overthinking';
}

function generateLuckyTime(sign: string, planets: any[]) {
  const hours = [9, 10, 11, 14, 15, 16, 19, 20, 21];
  const luckyHour = hours[Math.floor(Math.random() * hours.length)];
  const minute = Math.floor(Math.random() * 60);
  return `${luckyHour}:${minute.toString().padStart(2, '0')} ${luckyHour >= 12 ? 'PM' : 'AM'}`;
}

function generateLuckyNumber(sign: string, date: Date) {
  const baseNumbers: Record<string, number[]> = {
    Aries: [1, 9, 19], Taurus: [2, 6, 24], Gemini: [3, 5, 15],
    Cancer: [2, 7, 16], Leo: [1, 5, 19], Virgo: [5, 14, 23],
    Libra: [6, 15, 24], Scorpio: [8, 11, 18], Sagittarius: [3, 9, 12],
    Capricorn: [4, 8, 22], Aquarius: [4, 7, 11], Pisces: [3, 7, 12],
  };
  const nums = baseNumbers[sign] || [7];
  return nums[date.getDate() % nums.length];
}

export default {
  calculateCosmicEnergy,
  generateDailyReading,
  ZODIAC_DATA,
};
