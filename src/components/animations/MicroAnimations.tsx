import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

// 1. Star Twinkle Effect
export const TwinkleStar: React.FC<{ size?: number; delay?: number }> = ({ 
  size = 4, 
  delay = 0 
}) => {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1500 }),
          withTiming(0.8, { duration: 1500 })
        ),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#FFD700',
        },
        animatedStyle,
      ]}
    />
  );
};

// 2. Zodiac Glow Pulse
export const ZodiacGlow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000 }),
        withTiming(0.5, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          shadowColor: '#7B68EE',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 20,
          elevation: 10,
        },
        glowStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// 3. Floating Animation
export const FloatingElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={floatStyle}>{children}</Animated.View>;
};

// 4. Shimmer Effect
export const ShimmerOverlay: React.FC<{ width: number }> = ({ width }) => {
  const shimmerX = useSharedValue(-width);

  useEffect(() => {
    shimmerX.value = withRepeat(
      withTiming(width * 2, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );
  }, [width]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          width: width * 0.5,
          height: '100%',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
        },
        shimmerStyle,
      ]}
    />
  );
};

// 5. Pulse Animation
export const PulseElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={pulseStyle}>{children}</Animated.View>;
};
