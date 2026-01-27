/**
 * VOICE INPUT BUTTON
 * Animated microphone button for voice input
 */
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

interface VoiceButtonProps {
  isListening: boolean;
  onPress: () => void;
  size?: number;
}

export function VoiceButton({ isListening, onPress, size = 44 }: VoiceButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (isListening) {
      // Pulse animation when listening
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ),
        -1
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 0 }),
          withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) })
        ),
        -1
      );
      scale.value = withSpring(1.1);
    } else {
      pulseScale.value = 1;
      pulseOpacity.value = 0;
      scale.value = withSpring(1);
    }
  }, [isListening]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        {/* Pulse ring */}
        <Animated.View
          style={[
            styles.pulse,
            {
              width: size * 1.5,
              height: size * 1.5,
              borderRadius: size * 0.75,
              backgroundColor: colors.error,
            },
            pulseStyle,
          ]}
        />
        
        {/* Button */}
        <Animated.View
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: isListening ? colors.error : colors.bg.muted,
            },
            buttonStyle,
          ]}
        >
          <Ionicons
            name={isListening ? 'stop' : 'mic'}
            size={size * 0.5}
            color={isListening ? '#FFFFFF' : colors.text.secondary}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceButton;
