// Zodiac Utilities
import { ZODIAC, COLORS } from '../constants/theme';

export type ZodiacKey = keyof typeof ZODIAC;

// Get zodiac sign from date
export function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

// Get zodiac info by key
export function getZodiacInfo(key: string) {
  const k = key.toLowerCase() as ZodiacKey;
  return ZODIAC[k] || null;
}

// Get zodiac symbol
export function getZodiacSymbol(sign: string): string {
  const k = sign.toLowerCase() as ZodiacKey;
  return ZODIAC[k]?.symbol || '✦';
}

// Get zodiac emoji
export function getZodiacEmoji(sign: string): string {
  const k = sign.toLowerCase() as ZodiacKey;
  return ZODIAC[k]?.emoji || '⭐';
}

// Get element color
export function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    Fire: COLORS.celestial.mars,
    Earth: COLORS.intent.family,
    Air: COLORS.celestial.mercury,
    Water: COLORS.celestial.moon,
  };
  return colors[element] || COLORS.primary;
}

export default {
  getZodiacSign,
  getZodiacInfo,
  getZodiacSymbol,
  getZodiacEmoji,
  getElementColor,
};
