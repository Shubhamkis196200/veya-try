import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

type TextVariant = 
  | 'hero' 
  | 'display' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'bodyLarge' 
  | 'body' 
  | 'bodySmall' 
  | 'label' 
  | 'overline' 
  | 'caption';

interface CosmicTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
  align?: 'left' | 'center' | 'right';
  gold?: boolean;
  muted?: boolean;
  numberOfLines?: number;
}

export function CosmicText({
  children,
  variant = 'body',
  color,
  style,
  align,
  gold = false,
  muted = false,
  numberOfLines,
}: CosmicTextProps) {
  const textColor = gold 
    ? COLORS.textGold 
    : muted 
      ? COLORS.textMuted 
      : color || COLORS.textPrimary;

  return (
    <Text
      style={[
        FONTS[variant],
        { color: textColor, textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}
