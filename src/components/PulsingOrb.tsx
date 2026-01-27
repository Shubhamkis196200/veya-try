import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

interface PulsingOrbProps {
  size?: number;
  color?: string;
  children?: React.ReactNode;
}

export function PulsingOrb({ 
  size = 120, 
  color = COLORS.primary,
  children,
}: PulsingOrbProps) {
  const pulse = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const outerRingStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pulse.value, [0, 1], [1, 1.15]) },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: interpolate(pulse.value, [0, 1], [0.3, 0.6]),
  }));

  const middleRingStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pulse.value, [0, 1], [1, 1.08]) },
    ],
    opacity: interpolate(pulse.value, [0, 1], [0.4, 0.7]),
  }));

  const innerGlowStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pulse.value, [0, 1], [0.95, 1.02]) },
    ],
  }));

  return (
    <View style={[styles.container, { width: size * 1.5, height: size * 1.5 }]}>
      {/* Outer pulse ring */}
      <Animated.View style={[
        styles.ring,
        {
          width: size * 1.4,
          height: size * 1.4,
          borderRadius: size * 0.7,
          borderColor: color,
        },
        outerRingStyle,
      ]} />
      
      {/* Middle glow ring */}
      <Animated.View style={[
        styles.ring,
        {
          width: size * 1.2,
          height: size * 1.2,
          borderRadius: size * 0.6,
          borderColor: color,
          borderWidth: 1,
        },
        middleRingStyle,
      ]} />
      
      {/* Main orb */}
      <Animated.View style={[
        styles.orbContainer,
        { width: size, height: size, borderRadius: size / 2 },
        innerGlowStyle,
      ]}>
        <LinearGradient
          colors={[`${color}40`, `${color}15`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.orb, { borderRadius: size / 2 }]}
        >
          {/* Inner highlight */}
          <View style={[
            styles.innerOrb,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: size * 0.35,
              backgroundColor: `${color}20`,
            },
          ]}>
            {children}
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  orbContainer: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  orb: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  innerOrb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
