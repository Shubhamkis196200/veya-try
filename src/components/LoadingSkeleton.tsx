/**
 * LOADING SKELETON COMPONENTS
 * Smooth loading states for better UX
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({ 
  width: w = 100, 
  height = 20, 
  borderRadius = 8,
}: SkeletonProps) {
  const { colors } = useTheme();
  const shimmer = useSharedValue(0);
  
  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.ease }),
      -1,
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-width, width]) }],
  }));
  
  return (
    <View
      style={[
        {
          width: w,
          height,
          borderRadius,
          backgroundColor: colors.bg.muted,
          overflow: 'hidden',
        },
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.1)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export function CardSkeleton() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.bg.tertiary }]}>
      <Skeleton width={120} height={16} />
      <View style={{ height: 12 }} />
      <Skeleton width={200} height={14} />
      <View style={{ height: 8 }} />
      <Skeleton width={160} height={14} />
    </View>
  );
}

export function MessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.message, isUser && styles.messageUser]}>
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: isUser ? colors.primaryMuted : colors.bg.tertiary,
            alignSelf: isUser ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        <Skeleton width={200} height={14} />
        <View style={{ height: 6 }} />
        <Skeleton width={150} height={14} />
      </View>
    </View>
  );
}

export function ReadingSkeleton() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.reading, { backgroundColor: colors.bg.tertiary }]}>
      <View style={styles.readingHeader}>
        <Skeleton width={60} height={60} borderRadius={30} />
        <View style={styles.readingHeaderText}>
          <Skeleton width={100} height={18} />
          <View style={{ height: 8 }} />
          <Skeleton width={150} height={14} />
        </View>
      </View>
      <View style={{ height: 16 }} />
      <Skeleton width={280} height={14} />
      <View style={{ height: 8 }} />
      <Skeleton width={250} height={14} />
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={styles.home}>
      <View style={styles.homeHeader}>
        <Skeleton width={180} height={28} />
        <View style={{ height: 8 }} />
        <Skeleton width={120} height={16} />
      </View>
      <ReadingSkeleton />
      <View style={styles.homeActions}>
        <Skeleton width={100} height={80} borderRadius={12} />
        <Skeleton width={100} height={80} borderRadius={12} />
        <Skeleton width={100} height={80} borderRadius={12} />
      </View>
      <CardSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  message: {
    marginVertical: 4,
  },
  messageUser: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  reading: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  readingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingHeaderText: {
    marginLeft: 16,
    flex: 1,
  },
  home: {
    padding: 16,
  },
  homeHeader: {
    marginBottom: 24,
  },
  homeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
});

export default Skeleton;
