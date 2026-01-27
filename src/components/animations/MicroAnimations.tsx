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

// 6. Staggered Fade In - For lists and grids
export const StaggeredFadeIn: React.FC<{ 
  children: React.ReactNode; 
  index: number;
  baseDelay?: number;
}> = ({ children, index, baseDelay = 50 }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = index * baseDelay;
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) });
    }, delay);
    return () => clearTimeout(timeout);
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

// 7. Breathing Glow - For mystical elements
export const BreathingGlow: React.FC<{ 
  children: React.ReactNode;
  color?: string;
  intensity?: number;
}> = ({ children, color = '#A855F7', intensity = 20 }) => {
  const glowRadius = useSharedValue(intensity * 0.5);
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    glowRadius.value = withRepeat(
      withSequence(
        withTiming(intensity, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(intensity * 0.5, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: glowRadius.value,
    shadowOpacity: glowOpacity.value,
  }));

  return <Animated.View style={glowStyle}>{children}</Animated.View>;
};

// 8. Orbit Animation - For celestial objects
export const OrbitElement: React.FC<{ 
  children: React.ReactNode;
  radius?: number;
  duration?: number;
  reverse?: boolean;
}> = ({ children, radius = 50, duration = 10000, reverse = false }) => {
  const rotation = useSharedValue(reverse ? 360 : 0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(reverse ? 0 : 360, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { translateX: radius },
      { rotate: `${-rotation.value}deg` },
    ],
  }));

  return <Animated.View style={orbitStyle}>{children}</Animated.View>;
};

// 9. Scale On Press - For interactive elements
export const ScaleOnPress: React.FC<{ 
  children: React.ReactNode;
  scale?: number;
}> = ({ children, scale: pressScale = 0.95 }) => {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withTiming(pressScale, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 200, easing: Easing.bounce });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      style={animatedStyle}
      onTouchStart={onPressIn}
      onTouchEnd={onPressOut}
    >
      {children}
    </Animated.View>
  );
};

// 10. Fade Slide - Smooth entrance for modals and cards
export const FadeSlide: React.FC<{ 
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}> = ({ children, direction = 'up', delay = 0 }) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(direction === 'left' ? -30 : direction === 'right' ? 30 : 0);
  const translateY = useSharedValue(direction === 'up' ? 30 : direction === 'down' ? -30 : 0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
      translateX.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
