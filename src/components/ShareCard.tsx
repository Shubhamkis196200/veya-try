/**
 * SHARE CARD COMPONENT
 * Beautiful shareable reading cards for social
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';

interface ShareCardProps {
  type: 'daily' | 'compatibility' | 'tarot';
  title: string;
  content: string;
  zodiacSign?: string;
  date?: string;
}

export function ShareCard({ type, title, content, zodiacSign, date }: ShareCardProps) {
  const { colors } = useTheme();
  
  const shareReading = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const shareContent = `✨ ${title}\n\n${content}\n\n${zodiacSign ? `☉ ${zodiacSign}` : ''}\n\n🔮 Powered by Veya - Your Cosmic Guide`;
    
    try {
      await Share.share({
        message: shareContent,
        title: 'My Veya Reading',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.bg.elevated, colors.bg.tertiary]}
        style={[styles.card, { borderColor: colors.border.accent }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {type === 'daily' ? '☀️ Daily' : type === 'compatibility' ? '💕 Match' : '🎴 Tarot'}
            </Text>
          </View>
          {date && (
            <Text style={[styles.date, { color: colors.text.muted }]}>{date}</Text>
          )}
        </View>
        
        {/* Content */}
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
        <Text style={[styles.content, { color: colors.text.secondary }]}>{content}</Text>
        
        {/* Footer */}
        <View style={styles.footer}>
          {zodiacSign && (
            <Text style={[styles.zodiac, { color: colors.text.muted }]}>☉ {zodiacSign}</Text>
          )}
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: colors.primary }]}
            onPress={shareReading}
          >
            <Ionicons name="share-outline" size={18} color="#FFFFFF" />
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        {/* Watermark */}
        <View style={styles.watermark}>
          <Text style={[styles.watermarkText, { color: colors.text.muted }]}>
            ✨ Veya
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

// Invite friends component
export function InviteFriends() {
  const { colors } = useTheme();
  
  const inviteFriends = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await Share.share({
        message: `✨ I've been using Veya for my daily cosmic guidance and it's amazing!\n\nGet personalized astrology readings, birth chart analysis, and chat with an AI astrologer.\n\n🔮 Download Veya and discover your cosmic path!`,
        title: 'Join me on Veya',
      });
    } catch (error) {
      console.error('Invite failed:', error);
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.inviteCard, { backgroundColor: colors.bg.elevated }]}
      onPress={inviteFriends}
    >
      <View style={[styles.inviteIcon, { backgroundColor: colors.accentMuted }]}>
        <Ionicons name="people" size={24} color={colors.accent} />
      </View>
      <View style={styles.inviteContent}>
        <Text style={[styles.inviteTitle, { color: colors.text.primary }]}>
          Invite Friends
        </Text>
        <Text style={[styles.inviteSubtitle, { color: colors.text.muted }]}>
          Share the cosmic wisdom
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zodiac: {
    fontSize: 14,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  watermark: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    opacity: 0.5,
  },
  watermarkText: {
    fontSize: 11,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
  },
  inviteIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  inviteContent: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  inviteSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default ShareCard;
