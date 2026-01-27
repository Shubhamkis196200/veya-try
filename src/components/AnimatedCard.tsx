import React from 'react';
import { ViewStyle, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  delay?: number;
  style?: ViewStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedCard({
  children,
  onPress,
  delay = 0,
  style,
  disabled = false,
}: AnimatedCardProps) {
  const pressed = useSharedValue(0);
  const entered = useSharedValue(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      entered.value = withSpring(1, { damping: 15 });
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(entered.value, [0, 1], [0, 1]),
      transform: [
        { translateY: interpolate(entered.value, [0, 1], [20, 0]) },
        { scale: interpolate(pressed.value, [0, 1], [1, 0.98]) },
      ],
    };
  });

  const handlePressIn = () => {
    if (onPress && !disabled) {
      pressed.value = withSpring(1, { damping: 10 });
    }
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 10 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

export default AnimatedCard;
