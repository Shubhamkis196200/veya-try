/**
 * VEYA COLOR SYSTEM
 * Cosmic color palette with light/dark mode support
 */

// Base Palette
const palette = {
  // Primary - Cosmic Purple
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
    950: '#3B0764',
  },
  
  // Accent - Celestial Gold
  gold: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Semantic - Rose (Love)
  rose: {
    400: '#FB7185',
    500: '#F43F5E',
    600: '#E11D48',
  },
  
  // Semantic - Blue (Career)
  blue: {
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
  },
  
  // Semantic - Green (Growth)
  green: {
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
  },
  
  // Neutrals
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
} as const;

// Celestial Colors (Planets & Signs)
export const celestial = {
  sun: '#FFB800',
  moon: '#E8E8F0',
  mercury: '#8B8B8B',
  venus: '#FF69B4',
  mars: '#FF4444',
  jupiter: '#FFA500',
  saturn: '#8B7355',
  uranus: '#00CED1',
  neptune: '#4169E1',
  pluto: '#800080',
} as const;

// Zodiac Element Colors
export const elements = {
  fire: '#FF6B35',    // Aries, Leo, Sagittarius
  earth: '#6B8E23',   // Taurus, Virgo, Capricorn
  air: '#87CEEB',     // Gemini, Libra, Aquarius
  water: '#4169E1',   // Cancer, Scorpio, Pisces
} as const;

// Dark Theme Colors
export const dark = {
  // Backgrounds
  bg: {
    primary: '#08080F',
    secondary: '#0E0E18',
    tertiary: '#151522',
    elevated: '#1C1C2E',
    muted: '#252538',
  },
  
  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B8CC',
    tertiary: '#8888A0',
    muted: '#5A5A70',
    inverse: '#08080F',
  },
  
  // Brand
  primary: palette.purple[500],
  primaryLight: palette.purple[400],
  primaryDark: palette.purple[600],
  primaryMuted: 'rgba(168, 85, 247, 0.15)',
  
  accent: palette.gold[500],
  accentLight: palette.gold[400],
  accentMuted: 'rgba(245, 158, 11, 0.15)',
  
  // Semantic
  success: palette.green[500],
  warning: palette.gold[500],
  error: palette.rose[500],
  info: palette.blue[500],
  love: palette.rose[500],
  career: palette.blue[500],
  growth: palette.green[500],
  
  // Borders
  border: {
    default: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(255, 255, 255, 0.04)',
    accent: 'rgba(168, 85, 247, 0.3)',
    gold: 'rgba(245, 158, 11, 0.3)',
  },
  
  // Gradients
  gradient: {
    primary: ['#A855F7', '#F59E0B'] as const,
    cosmic: ['#0E0E18', '#1C1C2E', '#151522'] as const,
    card: ['rgba(168, 85, 247, 0.1)', 'rgba(245, 158, 11, 0.05)'] as const,
    glow: ['rgba(168, 85, 247, 0.4)', 'transparent'] as const,
  },
} as const;

// Light Theme Colors
export const light = {
  // Backgrounds
  bg: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    elevated: '#FFFFFF',
    muted: '#E2E8F0',
  },
  
  // Text
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#64748B',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
  
  // Brand
  primary: palette.purple[600],
  primaryLight: palette.purple[500],
  primaryDark: palette.purple[700],
  primaryMuted: 'rgba(147, 51, 234, 0.1)',
  
  accent: palette.gold[600],
  accentLight: palette.gold[500],
  accentMuted: 'rgba(217, 119, 6, 0.1)',
  
  // Semantic
  success: palette.green[600],
  warning: palette.gold[600],
  error: palette.rose[600],
  info: palette.blue[600],
  love: palette.rose[600],
  career: palette.blue[600],
  growth: palette.green[600],
  
  // Borders
  border: {
    default: 'rgba(0, 0, 0, 0.08)',
    light: 'rgba(0, 0, 0, 0.04)',
    accent: 'rgba(147, 51, 234, 0.3)',
    gold: 'rgba(217, 119, 6, 0.3)',
  },
  
  // Gradients
  gradient: {
    primary: ['#9333EA', '#D97706'] as const,
    cosmic: ['#F8FAFC', '#F1F5F9', '#E2E8F0'] as const,
    card: ['rgba(147, 51, 234, 0.05)', 'rgba(217, 119, 6, 0.02)'] as const,
    glow: ['rgba(147, 51, 234, 0.2)', 'transparent'] as const,
  },
} as const;

export { palette };
