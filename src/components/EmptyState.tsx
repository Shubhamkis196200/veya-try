/**
 * EMPTY STATE COMPONENTS
 * Beautiful empty states for better UX
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

interface EmptyStateProps {
  icon?: string;
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();
  
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      {emoji ? (
        <Text style={styles.emoji}>{emoji}</Text>
      ) : icon ? (
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryMuted }]}>
          <Ionicons name={icon as any} size={32} color={colors.primary} />
        </View>
      ) : null}
      
      <Animated.Text 
        entering={FadeInUp.delay(100)}
        style={[styles.title, { color: colors.text.primary }]}
      >
        {title}
      </Animated.Text>
      
      {description && (
        <Animated.Text 
          entering={FadeInUp.delay(200)}
          style={[styles.description, { color: colors.text.muted }]}
        >
          {description}
        </Animated.Text>
      )}
      
      {actionLabel && onAction && (
        <Animated.View entering={FadeInUp.delay(300)}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onAction}
          >
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// Preset empty states
export function NoReadingsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      emoji="🔮"
      title="No readings yet"
      description="Your cosmic journey begins here. Get your first reading!"
      actionLabel="Get Reading"
      onAction={onAction}
    />
  );
}

export function NoMessagesEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      emoji="✨"
      title="Start a conversation"
      description="Ask Veya anything about your cosmic path"
      actionLabel="Ask Question"
      onAction={onAction}
    />
  );
}

export function NoConnectionEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline"
      title="No connection"
      description="Please check your internet and try again"
      actionLabel="Retry"
      onAction={onAction}
    />
  );
}

export function ErrorState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      emoji="🌙"
      title="Something went wrong"
      description="The cosmic connection was disrupted. Let's try again."
      actionLabel="Try Again"
      onAction={onAction}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState;
