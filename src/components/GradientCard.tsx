import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface GradientCardProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  borderGlow?: boolean;
  padding?: number;
}

export function GradientCard({ 
  children, 
  colors = ['#16161F', '#12121A'] as const,
  style,
  borderGlow = false,
  padding = 20,
}: GradientCardProps) {
  return (
    <View style={[
      styles.container, 
      borderGlow && styles.glow,
      style
    ]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { padding }]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradient: {
    borderRadius: RADIUS.xl - 1,
  },
  glow: {
    borderColor: COLORS.borderGold,
    ...SHADOWS.glow,
  },
});
