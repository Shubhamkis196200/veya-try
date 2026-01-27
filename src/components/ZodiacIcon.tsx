import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ZODIAC, COLORS, FONTS, RADIUS } from '../constants/theme';

interface ZodiacIconProps {
  sign: string;
  size?: 'small' | 'medium' | 'large' | 'hero';
  showLabel?: boolean;
  style?: ViewStyle;
}

const SIZES = {
  small: { container: 40, symbol: 18 },
  medium: { container: 56, symbol: 24 },
  large: { container: 80, symbol: 36 },
  hero: { container: 120, symbol: 56 },
};

export function ZodiacIcon({ 
  sign, 
  size = 'medium', 
  showLabel = false,
  style,
}: ZodiacIconProps) {
  const signKey = sign.toLowerCase() as keyof typeof ZODIAC;
  const zodiacData = ZODIAC[signKey];
  
  if (!zodiacData) {
    return null;
  }

  const dimensions = SIZES[size];
  const elementColors: Record<string, readonly [string, string]> = {
    fire: ['#FF6B4A', '#E85A5A'] as const,
    earth: ['#7CB587', '#5A8B5A'] as const,
    air: ['#7EB8E2', '#5A9BE8'] as const,
    water: ['#9B8FD9', '#8B7EC8'] as const,
  };
  
  const colors = elementColors[zodiacData.element] || elementColors.fire;

  return (
    <View style={[styles.wrapper, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.container,
          {
            width: dimensions.container,
            height: dimensions.container,
            borderRadius: dimensions.container / 2,
          },
        ]}
      >
        <Text style={[styles.symbol, { fontSize: dimensions.symbol }]}>
          {zodiacData.symbol}
        </Text>
      </LinearGradient>
      
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{zodiacData.name}</Text>
          <Text style={styles.dates}>{zodiacData.dates}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    color: '#FFFFFF',
    fontWeight: '300',
  },
  labelContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  label: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  dates: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
