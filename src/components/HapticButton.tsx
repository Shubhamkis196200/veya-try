/**
 * HAPTIC BUTTON
 * TouchableOpacity with built-in haptic feedback
 */
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface HapticButtonProps extends TouchableOpacityProps {
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  scaleOnPress?: boolean;
}

export function HapticButton({
  children,
  onPress,
  hapticType = 'light',
  scaleOnPress = true,
  style,
  ...props
}: HapticButtonProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    if (scaleOnPress) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    }
  };
  
  const handlePressOut = () => {
    if (scaleOnPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };
  
  const handlePress = (e: any) => {
    switch (hapticType) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'selection':
        Haptics.selectionAsync();
        break;
    }
    onPress?.(e);
  };
  
  return (
    <AnimatedTouchable
      style={[animatedStyle, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      {...props}
    >
      {children}
    </AnimatedTouchable>
  );
}

export default HapticButton;
