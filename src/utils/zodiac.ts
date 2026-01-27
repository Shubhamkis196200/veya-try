// ═══════════════════════════════════════════════════════════════════════════
// ZODIAC UTILITIES
// Comprehensive zodiac calculations and data
// ═══════════════════════════════════════════════════════════════════════════

import { ZODIAC, COLORS, ZodiacKey } from '../constants/theme';

export interface ZodiacInfo {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  color: string;
  dates: string;
  ruling: string;
  key: ZodiacKey;
}

const ZODIAC_DATE_RANGES: { key: ZodiacKey; start: [number, number]; end: [number, number] }[] = [
  { key: 'capricorn', start: [12, 22], end: [1, 19] },
  { key: 'aquarius', start: [1, 20], end: [2, 18] },
  { key: 'pisces', start: [2, 19], end: [3, 20] },
  { key: 'aries', start: [3, 21], end: [4, 19] },
  { key: 'taurus', start: [4, 20], end: [5, 20] },
  { key: 'gemini', start: [5, 21], end: [6, 20] },
  { key: 'cancer', start: [6, 21], end: [7, 22] },
  { key: 'leo', start: [7, 23], end: [8, 22] },
  { key: 'virgo', start: [8, 23], end: [9, 22] },
  { key: 'libra', start: [9, 23], end: [10, 22] },
  { key: 'scorpio', start: [10, 23], end: [11, 21] },
  { key: 'sagittarius', start: [11, 22], end: [12, 21] },
];

/**
 * Get zodiac sign from a date
 */
export function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const range of ZODIAC_DATE_RANGES) {
    const [startMonth, startDay] = range.start;
    const [endMonth, endDay] = range.end;

    // Handle Capricorn which spans year end
    if (range.key === 'capricorn') {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return ZODIAC[range.key].name;
      }
    } else if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return ZODIAC[range.key].name;
    }
  }

  return 'Aries'; // Default fallback
}

/**
 * Get zodiac key from sign name
 */
export function getZodiacKey(sign: string): ZodiacKey {
  return sign.toLowerCase() as ZodiacKey;
}

/**
 * Get full zodiac info for a sign
 */
export function getZodiacInfo(sign: string): ZodiacInfo | null {
  const key = sign.toLowerCase() as ZodiacKey;
  const data = ZODIAC[key];
  
  if (!data) return null;
  
  return {
    ...data,
    key,
  };
}

/**
 * Get zodiac symbol for a sign
 */
export function getZodiacSymbol(sign: string): string {
  const key = sign.toLowerCase() as ZodiacKey;
  return ZODIAC[key]?.symbol || '✦';
}

/**
 * Get zodiac element for a sign
 */
export function getZodiacElement(sign: string): string {
  const key = sign.toLowerCase() as ZodiacKey;
  return ZODIAC[key]?.element || 'unknown';
}

/**
 * Get element color
 */
export function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    fire: COLORS.elements.fire,
    earth: COLORS.elements.earth,
    air: COLORS.elements.air,
    water: COLORS.elements.water,
  };
  return colors[element] || COLORS.textMuted;
}

/**
 * Get zodiac color based on element
 */
export function getZodiacColor(sign: string): string {
  const info = getZodiacInfo(sign);
  if (!info) return COLORS.textMuted;
  return getElementColor(info.element);
}

/**
 * Get compatible signs
 */
export function getCompatibleSigns(sign: string): string[] {
  const info = getZodiacInfo(sign);
  if (!info) return [];

  const compatibility: Record<string, ZodiacKey[]> = {
    fire: ['aries', 'leo', 'sagittarius', 'gemini', 'libra', 'aquarius'],
    earth: ['taurus', 'virgo', 'capricorn', 'cancer', 'scorpio', 'pisces'],
    air: ['gemini', 'libra', 'aquarius', 'aries', 'leo', 'sagittarius'],
    water: ['cancer', 'scorpio', 'pisces', 'taurus', 'virgo', 'capricorn'],
  };

  return (compatibility[info.element] || [])
    .filter(k => k !== info.key)
    .map(k => ZODIAC[k].name);
}

/**
 * Get moon phase from date
 */
export function getMoonPhase(date: Date): { name: string; emoji: string; illumination: number } {
  const LUNAR_CYCLE = 29.53059;
  const KNOWN_NEW_MOON = new Date('2024-01-11').getTime();
  
  const daysSinceNew = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  const phase = ((daysSinceNew % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  
  const phases = [
    { name: 'New Moon', emoji: '🌑', range: [0, 1.85] },
    { name: 'Waxing Crescent', emoji: '🌒', range: [1.85, 7.38] },
    { name: 'First Quarter', emoji: '🌓', range: [7.38, 11.07] },
    { name: 'Waxing Gibbous', emoji: '🌔', range: [11.07, 14.76] },
    { name: 'Full Moon', emoji: '🌕', range: [14.76, 18.45] },
    { name: 'Waning Gibbous', emoji: '🌖', range: [18.45, 22.14] },
    { name: 'Last Quarter', emoji: '🌗', range: [22.14, 25.83] },
    { name: 'Waning Crescent', emoji: '🌘', range: [25.83, 29.53] },
  ];

  const currentPhase = phases.find(p => phase >= p.range[0] && phase < p.range[1]) || phases[0];
  
  // Calculate illumination percentage
  let illumination: number;
  if (phase <= LUNAR_CYCLE / 2) {
    illumination = (phase / (LUNAR_CYCLE / 2)) * 100;
  } else {
    illumination = ((LUNAR_CYCLE - phase) / (LUNAR_CYCLE / 2)) * 100;
  }

  return {
    name: currentPhase.name,
    emoji: currentPhase.emoji,
    illumination: Math.round(illumination),
  };
}

/**
 * Get Chinese zodiac animal
 */
export function getChineseZodiac(year: number): { animal: string; element: string; emoji: string } {
  const animals = [
    { animal: 'Rat', emoji: '🐀' },
    { animal: 'Ox', emoji: '🐂' },
    { animal: 'Tiger', emoji: '🐅' },
    { animal: 'Rabbit', emoji: '🐇' },
    { animal: 'Dragon', emoji: '🐉' },
    { animal: 'Snake', emoji: '🐍' },
    { animal: 'Horse', emoji: '🐴' },
    { animal: 'Goat', emoji: '🐐' },
    { animal: 'Monkey', emoji: '🐒' },
    { animal: 'Rooster', emoji: '🐓' },
    { animal: 'Dog', emoji: '🐕' },
    { animal: 'Pig', emoji: '🐖' },
  ];

  const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];

  const animalIndex = (year - 4) % 12;
  const elementIndex = (year - 4) % 10;

  return {
    ...animals[animalIndex],
    element: elements[elementIndex],
  };
}

/**
 * Calculate age from DOB
 */
export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get days until next birthday
 */
export function getDaysUntilBirthday(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  
  if (nextBirthday <= today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = nextBirthday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
