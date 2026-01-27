/**
 * VEYA TYPOGRAPHY SYSTEM
 * Consistent text styles across the app
 */
import { TextStyle } from 'react-native';
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from './tokens';

type TypographyStyle = {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
  letterSpacing?: number;
};

export const typography: Record<string, TypographyStyle> = {
  // Display - Hero text, splash screens
  displayLarge: {
    fontSize: FONT_SIZE.display,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.display * LINE_HEIGHT.tight,
    letterSpacing: -1,
  },
  displayMedium: {
    fontSize: FONT_SIZE.hero,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.hero * LINE_HEIGHT.tight,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.xxxl * LINE_HEIGHT.tight,
  },
  
  // Headlines
  h1: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.xxl * LINE_HEIGHT.tight,
  },
  h2: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.xl * LINE_HEIGHT.tight,
  },
  h3: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.lg * LINE_HEIGHT.normal,
  },
  h4: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.normal,
  },
  
  // Body text
  bodyLarge: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.lg * LINE_HEIGHT.relaxed,
  },
  bodyMedium: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.relaxed,
  },
  bodySmall: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.md * LINE_HEIGHT.relaxed,
  },
  
  // Labels & UI
  labelLarge: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: FONT_SIZE.md * LINE_HEIGHT.normal,
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.normal,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: FONT_SIZE.xs * LINE_HEIGHT.normal,
    letterSpacing: 0.5,
  },
  
  // Captions
  caption: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.normal,
  },
  captionSmall: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.xs * LINE_HEIGHT.normal,
  },
  
  // Special
  button: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.tight,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.tight,
    letterSpacing: 0.5,
  },
  overline: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.xs * LINE_HEIGHT.normal,
    letterSpacing: 1.5,
  },
} as const;

// Helper to create text style with color
export const createTextStyle = (
  variant: keyof typeof typography,
  color: string
): TextStyle => ({
  ...typography[variant],
  color,
});
