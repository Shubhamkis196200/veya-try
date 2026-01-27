import React, { useEffect } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS } from '../constants/theme';

interface ShimmerTextProps {
  children: string;
  style?: TextStyle;
  duration?: number;
}

export function ShimmerText({ 
  children, 
  style,
  duration = 3000,
}: ShimmerTextProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      shimmer.value,
      [0, 0.3, 0.5, 0.7, 1],
      [0.6, 1, 0.8, 1, 0.6]
    ),
  }));

  return (
    <Animated.Text style={[styles.text, style, animatedStyle]}>
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...FONTS.body,
    color: COLORS.textMuted,
  },
});
