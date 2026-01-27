import { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
  scaleOnPress?: number;
}

export function AnimatedPressable({
  children,
  onPress,
  style,
  disabled = false,
  haptic = 'light',
  scaleOnPress = 0.97,
}: Props) {
  const pressed = useSharedValue(0);

  const handlePressIn = () => {
    pressed.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (disabled) return;
    
    // Haptic feedback
    if (haptic !== 'none') {
      const hapticMap = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      };
      Haptics.impactAsync(hapticMap[haptic]);
    }
    
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressed.value,
      [0, 1],
      [1, scaleOnPress],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity: disabled ? 0.5 : 1,
    };
  });

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedTouchable>
  );
}

// Card with hover/press effect
interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
}

export function AnimatedCard({ children, onPress, style, elevated = false }: AnimatedCardProps) {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(elevated ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    if (elevated) {
      elevation.value = withTiming(0.5, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    if (elevated) {
      elevation.value = withTiming(1, { duration: 150 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: interpolate(elevation.value, [0, 1], [0, 0.15]),
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.card, elevated && styles.cardElevated, style, animatedStyle]}
    >
      {children}
    </AnimatedTouchable>
  );
}

// Floating action with pulse
interface FloatingButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  pulse?: boolean;
}

export function FloatingButton({ children, onPress, style, pulse = false }: FloatingButtonProps) {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      const interval = setInterval(() => {
        pulseScale.value = withSpring(1.05, { damping: 10 }, () => {
          pulseScale.value = withSpring(1, { damping: 10 });
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <AnimatedPressable onPress={onPress} style={StyleSheet.flatten([styles.floatingButton, style])} haptic="medium">
      <Animated.View style={[styles.floatingButtonInner, animatedStyle]}>
        {children}
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  floatingButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default AnimatedPressable;
