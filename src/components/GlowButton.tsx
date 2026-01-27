import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, FONTS, RADIUS, SHADOWS, ANIMATION } from '../constants/theme';

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function GlowButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
  size = 'medium',
}: GlowButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled || loading) return;
    
    scale.value = withSequence(
      withSpring(0.95, ANIMATION.springBouncy),
      withSpring(1, ANIMATION.springBouncy)
    );
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const sizeStyles = {
    small: { paddingVertical: 10, paddingHorizontal: 16 },
    medium: { paddingVertical: 16, paddingHorizontal: 24 },
    large: { paddingVertical: 20, paddingHorizontal: 32 },
  };

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        activeOpacity={0.9}
        disabled={disabled || loading}
        style={[animatedStyle, style]}
      >
        <LinearGradient
          colors={disabled ? ['#4A4A58', '#3A3A48'] : ['#C9A962', '#9A7B3C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            sizeStyles[size],
            !disabled && SHADOWS.glow,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <>
              {icon}
              <Text style={styles.primaryText}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  if (variant === 'secondary') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={disabled || loading}
        style={[
          animatedStyle,
          styles.button,
          styles.secondaryButton,
          sizeStyles[size],
          disabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.textPrimary} />
        ) : (
          <>
            {icon}
            <Text style={styles.secondaryText}>{title}</Text>
          </>
        )}
      </AnimatedTouchable>
    );
  }

  // Ghost variant
  return (
    <AnimatedTouchable
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[
        animatedStyle,
        styles.button,
        styles.ghostButton,
        sizeStyles[size],
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : (
        <>
          {icon}
          <Text style={styles.ghostText}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  primaryText: {
    ...FONTS.bodyMedium,
    color: COLORS.textInverse,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryText: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    ...FONTS.bodyMedium,
    color: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
