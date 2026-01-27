import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    twinkleSpeed: Math.random() * 2000 + 1500,
  }));
};

interface Props {
  starCount?: number;
  animated?: boolean;
  density?: number;
}

export function StarField({ starCount = 50, animated = true }: Props) {
  const stars = useRef(generateStars(starCount)).current;
  const animatedValues = useRef(stars.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    if (!animated) return;

    const animations = stars.map((star, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValues[index], {
            toValue: 0.3,
            duration: star.twinkleSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[index], {
            toValue: 1,
            duration: star.twinkleSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    });

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [animated]);

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map((star, index) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: animated 
                ? animatedValues[index].interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [star.opacity * 0.3, star.opacity],
                  })
                : star.opacity,
            },
          ]}
        />
      ))}
      
      {/* Shooting stars - occasional */}
      <ShootingStar delay={3000} />
      <ShootingStar delay={7000} />
    </View>
  );
}

function ShootingStar({ delay }: { delay: number }) {
  const translateX = useRef(new Animated.Value(-50)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      const startX = Math.random() * width * 0.5;
      const startY = Math.random() * height * 0.3;
      
      translateX.setValue(startX);
      translateY.setValue(startY);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay + Math.random() * 5000),
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: startX + 150,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: startY + 100,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => animate());
    };

    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.shootingStar,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { rotate: '45deg' }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFF',
  },
  shootingStar: {
    position: 'absolute',
    width: 60,
    height: 2,
    backgroundColor: '#FFF',
    borderRadius: 1,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default StarField;
