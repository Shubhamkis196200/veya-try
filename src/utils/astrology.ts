// Astrology calculation utilities
// Based on birth date, time, and location

export interface BirthData {
  date: Date;
  time?: string; // HH:MM format
  latitude?: number;
  longitude?: number;
}

export interface BirthChart {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  mercury: string;
  venus: string;
  mars: string;
  jupiter: string;
  saturn: string;
}

// Zodiac sign dates
const ZODIAC_DATES = [
  { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
  { sign: 'Pisces', start: [2, 19], end: [3, 20] },
  { sign: 'Aries', start: [3, 21], end: [4, 19] },
  { sign: 'Taurus', start: [4, 20], end: [5, 20] },
  { sign: 'Gemini', start: [5, 21], end: [6, 20] },
  { sign: 'Cancer', start: [6, 21], end: [7, 22] },
  { sign: 'Leo', start: [7, 23], end: [8, 22] },
  { sign: 'Virgo', start: [8, 23], end: [9, 22] },
  { sign: 'Libra', start: [9, 23], end: [10, 22] },
  { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
];

// Get sun sign from birth date
export function getSunSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const zodiac of ZODIAC_DATES) {
    const [startMonth, startDay] = zodiac.start;
    const [endMonth, endDay] = zodiac.end;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return zodiac.sign;
      }
    } else if (startMonth > endMonth) {
      // Capricorn case (spans year boundary)
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay)) {
        return zodiac.sign;
      }
    } else {
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay)) {
        return zodiac.sign;
      }
    }
  }

  return 'Unknown';
}

// Simplified moon sign calculation (approximation)
export function getMoonSign(date: Date): string {
  // Moon changes sign every ~2.5 days
  // This is a simplified calculation
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const moonCycle = (dayOfYear * 12 / 365) % 12;
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return signs[Math.floor(moonCycle)];
}

// Simplified rising sign calculation (based on birth time)
export function getRisingSign(date: Date, birthTime?: string): string {
  if (!birthTime) return 'Unknown';
  
  const [hours] = birthTime.split(':').map(Number);
  const sunSign = getSunSign(date);
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  const sunIndex = signs.indexOf(sunSign);
  // Rising sign changes every 2 hours approximately
  const risingOffset = Math.floor(hours / 2);
  return signs[(sunIndex + risingOffset) % 12];
}

// Generate full birth chart
export function calculateBirthChart(birthData: BirthData): BirthChart {
  const { date, time } = birthData;
  
  return {
    sunSign: getSunSign(date),
    moonSign: getMoonSign(date),
    risingSign: getRisingSign(date, time),
    // Simplified planetary positions
    mercury: getSunSign(new Date(date.getTime() - 14 * 86400000)), // ~14 days behind sun
    venus: getSunSign(new Date(date.getTime() - 30 * 86400000)), // ~30 days behind
    mars: getSunSign(new Date(date.getTime() + 45 * 86400000)), // different cycle
    jupiter: getSunSign(new Date(date.getTime() + 120 * 86400000)),
    saturn: getSunSign(new Date(date.getTime() + 200 * 86400000)),
  };
}

// Zodiac element
export function getElement(sign: string): 'Fire' | 'Earth' | 'Air' | 'Water' {
  const elements: Record<string, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
  };
  return elements[sign] || 'Fire';
}

// Zodiac modality
export function getModality(sign: string): 'Cardinal' | 'Fixed' | 'Mutable' {
  const modalities: Record<string, 'Cardinal' | 'Fixed' | 'Mutable'> = {
    Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
    Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
    Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
  };
  return modalities[sign] || 'Cardinal';
}

// Sign traits
export function getSignTraits(sign: string): string[] {
  const traits: Record<string, string[]> = {
    Aries: ['Bold', 'Ambitious', 'Energetic', 'Competitive', 'Independent'],
    Taurus: ['Patient', 'Reliable', 'Devoted', 'Practical', 'Sensual'],
    Gemini: ['Curious', 'Adaptable', 'Witty', 'Social', 'Versatile'],
    Cancer: ['Nurturing', 'Intuitive', 'Protective', 'Emotional', 'Loyal'],
    Leo: ['Confident', 'Creative', 'Generous', 'Dramatic', 'Warm'],
    Virgo: ['Analytical', 'Practical', 'Helpful', 'Detail-oriented', 'Modest'],
    Libra: ['Diplomatic', 'Harmonious', 'Fair', 'Social', 'Romantic'],
    Scorpio: ['Intense', 'Passionate', 'Resourceful', 'Mysterious', 'Determined'],
    Sagittarius: ['Adventurous', 'Optimistic', 'Philosophical', 'Free-spirited', 'Honest'],
    Capricorn: ['Ambitious', 'Disciplined', 'Patient', 'Responsible', 'Traditional'],
    Aquarius: ['Innovative', 'Independent', 'Humanitarian', 'Original', 'Intellectual'],
    Pisces: ['Compassionate', 'Intuitive', 'Artistic', 'Dreamy', 'Empathetic'],
  };
  return traits[sign] || [];
}

// Daily lucky items based on sign and date
export function getDailyLucky(sign: string, date: Date): { number: number; color: string; time: string } {
  const day = date.getDate();
  const month = date.getMonth();
  
  const colors = ['Gold', 'Silver', 'Blue', 'Green', 'Purple', 'Red', 'White', 'Orange', 'Pink', 'Turquoise'];
  const times = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '11 PM'];
  
  const signIndex = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                     'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(sign);
  
  return {
    number: ((day + signIndex + month) % 9) + 1,
    color: colors[(day + signIndex) % colors.length],
    time: times[(day + month) % times.length],
  };
}

export default {
  getSunSign,
  getMoonSign,
  getRisingSign,
  calculateBirthChart,
  getElement,
  getModality,
  getSignTraits,
  getDailyLucky,
};
