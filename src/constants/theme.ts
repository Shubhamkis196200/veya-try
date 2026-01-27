// ═══════════════════════════════════════════════════════════════════════════
// VEYA PREMIUM DESIGN SYSTEM
// Inspired by Co-Star, The Pattern, Sanctuary, Nebula
// Dark cosmic aesthetic with mystical elegance
// ═══════════════════════════════════════════════════════════════════════════

export const COLORS = {
  // ─── CORE BACKGROUNDS ─────────────────────────────────────────────────────
  background: '#0A0A0F',           // Deep space black
  backgroundElevated: '#12121A',   // Slightly lifted surfaces
  backgroundCard: '#16161F',       // Card backgrounds
  backgroundMuted: '#1E1E28',      // Muted sections
  backgroundGlow: '#1A1A2E',       // Sections with glow

  // ─── PRIMARY - CELESTIAL GOLD ─────────────────────────────────────────────
  primary: '#C9A962',              // Elegant gold
  primaryLight: '#E8D5A3',         // Soft gold highlight
  primaryDark: '#9A7B3C',          // Deep gold
  primaryMuted: 'rgba(201, 169, 98, 0.15)', // Subtle gold bg

  // ─── ACCENT - COSMIC PURPLE ───────────────────────────────────────────────
  accent: '#8B7EC8',               // Mystical purple
  accentLight: '#A99FDA',          // Light purple
  accentMuted: 'rgba(139, 126, 200, 0.15)',

  // ─── TEXT ─────────────────────────────────────────────────────────────────
  textPrimary: '#FFFFFF',          // Pure white
  textSecondary: '#B8B8C7',        // Soft gray
  textMuted: '#6B6B7B',            // Muted gray
  textDim: '#4A4A58',              // Very subtle
  textInverse: '#0A0A0F',          // For light backgrounds
  textGold: '#C9A962',
  textLight: '#E8E8F0',             // Gold accent text

  // ─── ZODIAC ELEMENT COLORS ────────────────────────────────────────────────
  elements: {
    fire: '#FF6B4A',               // Aries, Leo, Sagittarius
    earth: '#7CB587',              // Taurus, Virgo, Capricorn  
    air: '#7EB8E2',                // Gemini, Libra, Aquarius
    water: '#9B8FD9',              // Cancer, Scorpio, Pisces
  } as const,

  // ─── INTENT COLORS ────────────────────────────────────────────────────────
  intent: {
    love: '#E85A8F',               // Rose pink
    career: '#5A9BE8',             // Professional blue
    family: '#7CB587',             // Nurturing green
    growth: '#9B8FD9',             // Spiritual purple
    wealth: '#E8B85A',             // Prosperity gold
    general: '#8B8B9B',            // Neutral gray
  } as const,

  // ─── METHOD COLORS ────────────────────────────────────────────────────────
  method: {
    vedic: '#9B8FD9',              // Ancient purple
    western: '#E8B85A',            // Classic gold
    chinese: '#E85A5A',            // Eastern red
  } as const,

  // ─── CELESTIAL BODIES ─────────────────────────────────────────────────────
  celestial: {
    sun: '#FFB347',
    moon: '#C7D0E8',
    mercury: '#7EB8E2',
    venus: '#E8A5C7',
    mars: '#E85A5A',
    jupiter: '#E8B85A',
    saturn: '#8B8B9B',
    uranus: '#7ED9E8',
    neptune: '#9B8FD9',
    pluto: '#6B5A7E',
  } as const,

  // ─── UTILITY ──────────────────────────────────────────────────────────────
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  borderGold: 'rgba(201, 169, 98, 0.3)',
  divider: 'rgba(255, 255, 255, 0.06)',
  
  success: '#7CB587',
  error: '#E85A5A',
  warning: '#E8B85A',
  
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  
  // Glow effects
  glowGold: 'rgba(201, 169, 98, 0.4)',
  glowPurple: 'rgba(139, 126, 200, 0.4)',
  glowWhite: 'rgba(255, 255, 255, 0.2)',
} as const;

// ─── GRADIENTS ────────────────────────────────────────────────────────────
export const GRADIENTS = {
  // Card backgrounds
  cardDark: ['#16161F', '#12121A'],
  cardGlow: ['rgba(201, 169, 98, 0.08)', 'rgba(139, 126, 200, 0.04)'],
  
  // Hero sections
  cosmic: ['#1A1A2E', '#16161F', '#0A0A0F'],
  cosmicRadial: ['rgba(139, 126, 200, 0.15)', 'transparent'],
  
  // Accent gradients
  goldShimmer: ['#C9A962', '#E8D5A3', '#C9A962'],
  purpleMist: ['#9B8FD9', '#8B7EC8', '#6B5A7E'],
  
  // Energy bars
  energyHigh: ['#7CB587', '#5A9BE8'],
  energyMedium: ['#E8B85A', '#E85A8F'],
  energyLow: ['#E85A5A', '#9B4A4A'],
  
  // Buttons
  primaryButton: ['#C9A962', '#B8963F'],
  secondaryButton: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  
  // Overlays
  fadeUp: ['transparent', '#0A0A0F'],
  fadeDown: ['#0A0A0F', 'transparent'],
  
  // Zodiac elements
  fire: ['#FF6B4A', '#E85A5A'],
  earth: ['#7CB587', '#5A8B5A'],
  air: ['#7EB8E2', '#5A9BE8'],
  water: ['#9B8FD9', '#8B7EC8'],
} as const;

// ─── SPACING ──────────────────────────────────────────────────────────────
export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────────
export const FONTS = {
  // Hero/Display - For big moments
  hero: {
    fontSize: 56,
    fontWeight: '200' as const,
    letterSpacing: -2,
    lineHeight: 64,
  },
  
  // Display - Section headers
  display: {
    fontSize: 40,
    fontWeight: '300' as const,
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  
  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    lineHeight: 26,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    lineHeight: 22,
  },
  
  // Labels and accents
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
  },
  
  // Small text
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  
  // Overlines
  overline: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  },
  
  // Numbers
  number: {
    fontSize: 48,
    fontWeight: '200' as const,
    letterSpacing: -2,
    lineHeight: 56,
  },
  numberSmall: {
    fontSize: 32,
    fontWeight: '300' as const,
    letterSpacing: -1,
    lineHeight: 40,
  },
} as const;

// ─── RADIUS ───────────────────────────────────────────────────────────────
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
  full: 999,
} as const;

// ─── SHADOWS ──────────────────────────────────────────────────────────────
export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  glowPurple: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

// ─── ANIMATION ────────────────────────────────────────────────────────────
export const ANIMATION = {
  // Timing
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
  
  // Spring configs
  springDefault: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 12,
    stiffness: 180,
    mass: 0.8,
  },
  springSmooth: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  
  // Easing (for non-reanimated)
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeIn: [0.6, 0, 0.84, 0] as [number, number, number, number],
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const;

// ─── INTENT CONFIGURATION ─────────────────────────────────────────────────
export const INTENTS = {
  love: {
    key: 'love',
    title: 'Love & Relationships',
    description: 'Navigate the cosmic dance of connection',
    icon: 'heart',
    color: COLORS.intent.love,
    gradient: ['#E85A8F', '#9B8FD9'],
    symbol: '♡',
  },
  career: {
    key: 'career',
    title: 'Career & Purpose',
    description: 'Align your work with the stars',
    icon: 'briefcase',
    color: COLORS.intent.career,
    gradient: ['#5A9BE8', '#7EB8E2'],
    symbol: '◈',
  },
  family: {
    key: 'family',
    title: 'Family & Home',
    description: 'Nurture your sacred bonds',
    icon: 'home',
    color: COLORS.intent.family,
    gradient: ['#7CB587', '#5A8B5A'],
    symbol: '⌂',
  },
  growth: {
    key: 'growth',
    title: 'Personal Growth',
    description: 'Unlock your cosmic potential',
    icon: 'trending-up',
    color: COLORS.intent.growth,
    gradient: ['#9B8FD9', '#8B7EC8'],
    symbol: '✦',
  },
  wealth: {
    key: 'wealth',
    title: 'Wealth & Abundance',
    description: 'Manifest prosperity through the stars',
    icon: 'star',
    color: COLORS.intent.wealth,
    gradient: ['#E8B85A', '#C9A962'],
    symbol: '❖',
  },
  general: {
    key: 'general',
    title: 'General Guidance',
    description: 'Holistic cosmic wisdom',
    icon: 'compass',
    color: COLORS.intent.general,
    gradient: ['#8B8B9B', '#6B6B7B'],
    symbol: '◎',
  },
} as const;

// ─── METHOD CONFIGURATION ─────────────────────────────────────────────────
export const METHODS = {
  vedic: {
    key: 'vedic',
    title: 'Vedic Astrology',
    subtitle: 'Jyotish · Ancient Wisdom',
    description: 'The sidereal tradition revealing karmic patterns and soul purpose.',
    icon: 'moon',
    color: COLORS.method.vedic,
    gradient: ['#9B8FD9', '#6B5A7E'],
  },
  western: {
    key: 'western',
    title: 'Western Astrology',
    subtitle: 'Tropical · Psychological',
    description: 'The tropical tradition mapping personality and life cycles.',
    icon: 'sunny',
    color: COLORS.method.western,
    gradient: ['#E8B85A', '#C9A962'],
  },
  chinese: {
    key: 'chinese',
    title: 'Chinese Astrology',
    subtitle: 'Shēngxiào · Elemental',
    description: 'Ancient cycles of animals and elements shaping destiny.',
    icon: 'globe',
    color: COLORS.method.chinese,
    gradient: ['#E85A5A', '#9B4A4A'],
  },
} as const;

// ─── ZODIAC DATA ──────────────────────────────────────────────────────────
export const ZODIAC = {
  aries: {
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    color: COLORS.elements.fire,
    dates: 'Mar 21 - Apr 19',
    ruling: 'Mars',
  },
  taurus: {
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    color: COLORS.elements.earth,
    dates: 'Apr 20 - May 20',
    ruling: 'Venus',
  },
  gemini: {
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    color: COLORS.elements.air,
    dates: 'May 21 - Jun 20',
    ruling: 'Mercury',
  },
  cancer: {
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    color: COLORS.elements.water,
    dates: 'Jun 21 - Jul 22',
    ruling: 'Moon',
  },
  leo: {
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    color: COLORS.elements.fire,
    dates: 'Jul 23 - Aug 22',
    ruling: 'Sun',
  },
  virgo: {
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    color: COLORS.elements.earth,
    dates: 'Aug 23 - Sep 22',
    ruling: 'Mercury',
  },
  libra: {
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    color: COLORS.elements.air,
    dates: 'Sep 23 - Oct 22',
    ruling: 'Venus',
  },
  scorpio: {
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    color: COLORS.elements.water,
    dates: 'Oct 23 - Nov 21',
    ruling: 'Pluto',
  },
  sagittarius: {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    color: COLORS.elements.fire,
    dates: 'Nov 22 - Dec 21',
    ruling: 'Jupiter',
  },
  capricorn: {
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    color: COLORS.elements.earth,
    dates: 'Dec 22 - Jan 19',
    ruling: 'Saturn',
  },
  aquarius: {
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    color: COLORS.elements.air,
    dates: 'Jan 20 - Feb 18',
    ruling: 'Uranus',
  },
  pisces: {
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    color: COLORS.elements.water,
    dates: 'Feb 19 - Mar 20',
    ruling: 'Neptune',
  },
} as const;

export type IntentKey = keyof typeof INTENTS;
export type MethodKey = keyof typeof METHODS;
export type ZodiacKey = keyof typeof ZODIAC;
export type ElementType = 'fire' | 'earth' | 'air' | 'water';
