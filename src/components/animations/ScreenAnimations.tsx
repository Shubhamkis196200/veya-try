/**
 * SCREEN ANIMATIONS
 * Reusable animation configurations for consistent screen transitions
 */
import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideInLeft,
  SlideInRight,
  SlideOutDown,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
  BounceIn,
  BounceInDown,
  FlipInXUp,
  FlipInYLeft,
  LightSpeedInLeft,
  LightSpeedInRight,
  RotateInDownLeft,
  RotateInDownRight,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// Animation durations
export const DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  pulse: 2000,
} as const;

// Spring configurations
export const SPRING = {
  gentle: { damping: 15, stiffness: 100 },
  bouncy: { damping: 10, stiffness: 150 },
  stiff: { damping: 20, stiffness: 200 },
  smooth: { damping: 18, stiffness: 80 },
} as const;

// ============================================
// Screen Entry Animations
// ============================================

// Fade animations with delays for staggered content
export const screenFadeIn = FadeIn.duration(DURATION.normal);
export const headerFadeIn = FadeInDown.duration(DURATION.normal);
export const contentFadeIn = (delay: number) => FadeInDown.duration(DURATION.slow).delay(delay);
export const cardFadeIn = (index: number) => FadeInDown.duration(DURATION.slow).delay(100 + index * 80);

// Slide animations
export const slideFromBottom = SlideInDown.duration(DURATION.slow).springify().damping(15);
export const slideFromTop = SlideInUp.duration(DURATION.slow).springify().damping(15);
export const slideFromLeft = SlideInLeft.duration(DURATION.slow).springify().damping(15);
export const slideFromRight = SlideInRight.duration(DURATION.slow).springify().damping(15);

// Zoom animations
export const zoomIn = ZoomIn.duration(DURATION.normal).springify().damping(12);
export const bounceIn = BounceIn.duration(DURATION.slow);
export const bounceInDown = BounceInDown.duration(DURATION.slow);

// Premium entrance effects
export const premiumFadeIn = FadeIn.duration(DURATION.slower).easing(Easing.bezier(0.25, 0.1, 0.25, 1));
export const mysticalEntrance = FadeInUp.duration(DURATION.slower).springify().damping(14);

// Exit animations
export const screenFadeOut = FadeOut.duration(DURATION.fast);
export const slideOutDown = SlideOutDown.duration(DURATION.normal);
export const slideOutUp = SlideOutUp.duration(DURATION.normal);
export const zoomOut = ZoomOut.duration(DURATION.fast);

// ============================================
// Animation Hooks
// ============================================

/**
 * Creates a pulsing animation effect
 */
export const usePulseAnimation = (minScale = 0.95, maxScale = 1.05) => {
  const scale = useSharedValue(1);

  const startPulse = () => {
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, { duration: DURATION.pulse / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(minScale, { duration: DURATION.pulse / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  };

  const stopPulse = () => {
    scale.value = withSpring(1, SPRING.gentle);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, startPulse, stopPulse, scale };
};

/**
 * Creates a floating animation effect (for celestial elements)
 */
export const useFloatingAnimation = (amplitude = 10, duration = 3000) => {
  const translateY = useSharedValue(0);

  const startFloating = () => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(amplitude, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  };

  const stopFloating = () => {
    translateY.value = withSpring(0, SPRING.gentle);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, startFloating, stopFloating, translateY };
};

/**
 * Creates a glow/shimmer animation
 */
export const useGlowAnimation = (minOpacity = 0.3, maxOpacity = 1) => {
  const opacity = useSharedValue(minOpacity);

  const startGlow = () => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(maxOpacity, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(minOpacity, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  };

  const stopGlow = () => {
    opacity.value = withTiming(1, { duration: DURATION.normal });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { animatedStyle, startGlow, stopGlow, opacity };
};

/**
 * Creates a rotation animation (for cosmic elements like stars, planets)
 */
export const useRotationAnimation = (duration = 60000) => {
  const rotation = useSharedValue(0);

  const startRotation = () => {
    rotation.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1,
      false
    );
  };

  const stopRotation = () => {
    rotation.value = withTiming(0, { duration: DURATION.slow });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return { animatedStyle, startRotation, stopRotation, rotation };
};

/**
 * Creates a staggered list animation effect
 */
export const useStaggeredList = (itemCount: number, baseDelay = 50) => {
  return Array.from({ length: itemCount }, (_, index) => ({
    entering: FadeInDown.duration(DURATION.slow).delay(baseDelay * index).springify().damping(14),
  }));
};

/**
 * Creates a scale press animation for interactive elements
 */
export const useScalePress = (pressedScale = 0.95) => {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(pressedScale, SPRING.stiff);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, SPRING.bouncy);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, onPressIn, onPressOut, scale };
};

/**
 * Creates a shimmer loading effect
 */
export const useShimmerAnimation = () => {
  const progress = useSharedValue(0);

  const startShimmer = () => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
      -1,
      false
    );
  };

  const stopShimmer = () => {
    progress.value = 0;
  };

  return { progress, startShimmer, stopShimmer };
};

/**
 * Creates an energy meter animation
 */
export const useEnergyMeter = () => {
  const width = useSharedValue(0);

  const setEnergy = (percentage: number) => {
    width.value = withSpring(percentage / 100, {
      damping: 15,
      stiffness: 100,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return { animatedStyle, setEnergy, width };
};

/**
 * Creates a card flip animation
 */
export const useCardFlip = () => {
  const rotateY = useSharedValue(0);
  const isFlipped = useSharedValue(false);

  const flip = () => {
    const targetRotation = isFlipped.value ? 0 : 180;
    rotateY.value = withSequence(
      withTiming(90, { duration: DURATION.normal }),
      withTiming(targetRotation, { duration: DURATION.normal })
    );
    isFlipped.value = !isFlipped.value;
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
    opacity: rotateY.value <= 90 ? 1 : 0,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value - 180}deg` }],
    opacity: rotateY.value > 90 ? 1 : 0,
  }));

  return { flip, frontStyle, backStyle, isFlipped };
};

// ============================================
// Animated Components
// ============================================

interface AnimatedScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const AnimatedScreenContainer = ({ children, style }: AnimatedScreenContainerProps) => {
  return (
    <Animated.View 
      entering={screenFadeIn} 
      exiting={screenFadeOut}
      style={style}
    >
      {children}
    </Animated.View>
  );
};
