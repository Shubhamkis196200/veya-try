// Premium Theme System with Dark & Light Mode
import { Appearance } from 'react-native';

export type ThemeMode = 'dark' | 'light' | 'system';

// Premium Color Palette
const palette = {
  // Primary Brand Colors
  purple: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B7FD9',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  gold: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#C9A962',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  rose: {
    400: '#FB7185',
    500: '#E85A8F',
    600: '#E11D48',
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
};

// Dark Theme (Premium Cosmic)
export const darkTheme = {
  mode: 'dark' as const,
  
  colors: {
    // Backgrounds
    background: '#08080C',
    backgroundSecondary: '#0F0F15',
    backgroundCard: '#16161F',
    backgroundElevated: '#1C1C28',
    backgroundMuted: '#252532',
    
    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#B8B8C7',
    textMuted: '#6B6B7B',
    textInverse: '#08080C',
    
    // Brand
    primary: palette.purple[500],
    primaryLight: palette.purple[400],
    primaryMuted: 'rgba(139, 127, 217, 0.15)',
    accent: palette.gold[500],
    accentLight: palette.gold[400],
    accentMuted: 'rgba(201, 169, 98, 0.15)',
    
    // Semantic
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    
    // Borders
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.04)',
    borderGold: 'rgba(201, 169, 98, 0.3)',
    borderPurple: 'rgba(139, 127, 217, 0.3)',
    
    // Gradients
    gradientPrimary: ['#8B7FD9', '#C9A962'],
    gradientCosmic: ['#1a1a2e', '#16213e', '#0f3460'],
    gradientCard: ['rgba(139, 127, 217, 0.1)', 'rgba(201, 169, 98, 0.05)'],
    
    // Intent Colors
    intent: {
      love: palette.rose[500],
      career: '#5A9BE8',
      family: '#7CB587',
      growth: palette.purple[400],
      wealth: palette.gold[500],
      health: '#4ADE80',
    },
    
    // Celestial
    celestial: {
      sun: '#FFD93D',
      moon: '#E8E8F0',
      mars: '#FF6B6B',
      venus: '#FF8ED4',
      mercury: '#A8D8FF',
      jupiter: '#FFB347',
      saturn: '#DDA0DD',
    },
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.6)',
    shimmer: 'rgba(255, 255, 255, 0.05)',
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: palette.purple[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
    },
    glow: {
      shadowColor: palette.purple[500],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 0,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
  },
};

// Light Theme (Premium Clean)
export const lightTheme = {
  mode: 'light' as const,
  
  colors: {
    // Backgrounds
    background: '#FAFBFF',
    backgroundSecondary: '#F1F3F9',
    backgroundCard: '#FFFFFF',
    backgroundElevated: '#FFFFFF',
    backgroundMuted: '#E8EBF2',
    
    // Text
    textPrimary: '#1A1A2E',
    textSecondary: '#4A4A5A',
    textMuted: '#8B8B9B',
    textInverse: '#FFFFFF',
    
    // Brand
    primary: palette.purple[600],
    primaryLight: palette.purple[500],
    primaryMuted: 'rgba(124, 58, 237, 0.1)',
    accent: palette.gold[600],
    accentLight: palette.gold[500],
    accentMuted: 'rgba(217, 119, 6, 0.1)',
    
    // Semantic
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Borders
    border: 'rgba(0, 0, 0, 0.08)',
    borderLight: 'rgba(0, 0, 0, 0.04)',
    borderGold: 'rgba(217, 119, 6, 0.3)',
    borderPurple: 'rgba(124, 58, 237, 0.3)',
    
    // Gradients
    gradientPrimary: [palette.purple[600], palette.gold[500]],
    gradientCosmic: ['#F5F3FF', '#FEF3C7', '#FCE7F3'],
    gradientCard: ['rgba(124, 58, 237, 0.05)', 'rgba(217, 119, 6, 0.03)'],
    
    // Intent Colors
    intent: {
      love: palette.rose[600],
      career: '#2563EB',
      family: '#16A34A',
      growth: palette.purple[600],
      wealth: palette.gold[600],
      health: '#22C55E',
    },
    
    // Celestial
    celestial: {
      sun: '#F59E0B',
      moon: '#6366F1',
      mars: '#DC2626',
      venus: '#EC4899',
      mercury: '#0EA5E9',
      jupiter: '#F97316',
      saturn: '#A855F7',
    },
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.4)',
    shimmer: 'rgba(255, 255, 255, 0.8)',
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
    },
    glow: {
      shadowColor: palette.purple[500],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 0,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
  },
};

export type Theme = typeof darkTheme | typeof lightTheme;

// Shared values (same in both themes)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

// Animation timings for smooth 60fps
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 400,
  verySlow: 600,
  spring: {
    damping: 15,
    stiffness: 150,
  },
  timing: {
    easeInOut: [0.4, 0.0, 0.2, 1],
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
  },
} as const;

export const FONTS = {
  // Display - Premium, refined typography
  h1: {
    fontSize: 34,
    fontWeight: '300' as const,
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  h2: {
    fontSize: 26,
    fontWeight: '400' as const,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  h3: {
    fontSize: 22,
    fontWeight: '500' as const,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  
  // Body - Comfortable reading
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 30,
    letterSpacing: -0.1,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  
  // Utility
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  overline: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
} as const;

// Zodiac data
export const ZODIAC = {
  aries: { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire', emoji: '🐏' },
  taurus: { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth', emoji: '🐂' },
  gemini: { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air', emoji: '👯' },
  cancer: { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water', emoji: '🦀' },
  leo: { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire', emoji: '🦁' },
  virgo: { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth', emoji: '👸' },
  libra: { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air', emoji: '⚖️' },
  scorpio: { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water', emoji: '🦂' },
  sagittarius: { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire', emoji: '🏹' },
  capricorn: { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth', emoji: '🐐' },
  aquarius: { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air', emoji: '🏺' },
  pisces: { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water', emoji: '🐟' },
} as const;

export const INTENTS = {
  love: { key: 'love', title: 'Love & Relationships', icon: 'heart', color: darkTheme.colors.intent.love, symbol: '❤️', description: 'Find love and deepen connections' },
  career: { key: 'career', title: 'Career & Success', icon: 'briefcase', color: darkTheme.colors.intent.career, symbol: '💼', description: 'Advance your professional life' },
  family: { key: 'family', title: 'Family & Home', icon: 'home', color: darkTheme.colors.intent.family, symbol: '🏠', description: 'Strengthen family bonds' },
  growth: { key: 'growth', title: 'Personal Growth', icon: 'trending-up', color: darkTheme.colors.intent.growth, symbol: '🌱', description: 'Evolve and transform yourself' },
  wealth: { key: 'wealth', title: 'Wealth & Prosperity', icon: 'cash', color: darkTheme.colors.intent.wealth, symbol: '💰', description: 'Attract abundance and wealth' },
  health: { key: 'health', title: 'Health & Wellness', icon: 'fitness', color: darkTheme.colors.intent.health, symbol: '💪', description: 'Improve your wellbeing' },
} as const;

// Legacy exports for compatibility
export const COLORS = darkTheme.colors;

// Methods for fortune telling
export const METHODS = {
  astrology: { 
    key: 'astrology',
    title: 'Astrology', 
    icon: 'planet', 
    description: 'Star-based guidance',
    subtitle: 'Star-based guidance',
    symbol: '✨',
    color: darkTheme.colors.primary,
  },
  tarot: { 
    key: 'tarot',
    title: 'Tarot', 
    icon: 'albums', 
    description: 'Card readings',
    subtitle: 'Card readings',
    symbol: '🎴',
    color: darkTheme.colors.accent,
  },
  numerology: { 
    key: 'numerology',
    title: 'Numerology', 
    icon: 'calculator', 
    description: 'Number wisdom',
    subtitle: 'Number wisdom',
    symbol: '🔢',
    color: darkTheme.colors.intent.growth,
  },
} as const;
export type ZodiacKey = keyof typeof ZODIAC;
