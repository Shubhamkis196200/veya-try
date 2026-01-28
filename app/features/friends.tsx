/**
 * FRIENDS SCREEN
 * View friends, add new friends, check compatibility
 */
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores';
import { friendService, Friend, CompatibilityResult } from '../../src/lib/friends';
import { StarField } from '../../src/components';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function FriendsScreen() {
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();
  const { profile } = useAuthStore();
  const userSign = profile?.sun_sign || profile?.zodiac_sign || 'Aries';
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendSign, setNewFriendSign] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  
  // Load friends
  useEffect(() => {
    loadFriends();
  }, []);
  
  const loadFriends = async () => {
    const loaded = await friendService.initialize(profile?.id || 'guest');
    setFriends(loaded);
  };
  
  const addFriend = async () => {
    if (!newFriendName.trim() || !newFriendSign) {
      Alert.alert('Missing Info', 'Please enter name and zodiac sign');
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const friend = await friendService.addFriend({
      name: newFriendName.trim(),
      zodiac_sign: newFriendSign,
    }, userSign);
    
    setFriends([friend, ...friends]);
    setNewFriendName('');
    setNewFriendSign('');
    setShowAddModal(false);
  };
  
  const removeFriend = async (friendId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Remove Friend',
      'Are you sure you want to remove this friend?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await friendService.removeFriend(friendId);
            setFriends(friends.filter(f => f.id !== friendId));
          },
        },
      ]
    );
  };
  
  const viewCompatibility = (friend: Friend) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFriend(friend);
    const compat = friendService.getCompatibilityDetails(userSign, friend);
    setCompatibility(compat);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: '#08080F' }]}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
      <StarField starCount={25} />
      
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border.default }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Friends</Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {/* Friend compatibility modal */}
          {selectedFriend && compatibility && (
            <Animated.View 
              entering={FadeIn}
              style={[styles.compatibilityCard, { backgroundColor: colors.bg.elevated }]}
            >
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => { setSelectedFriend(null); setCompatibility(null); }}
              >
                <Ionicons name="close" size={24} color={colors.text.muted} />
              </TouchableOpacity>
              
              <View style={styles.compatHeader}>
                <View style={[styles.signBadge, { backgroundColor: colors.primaryMuted }]}>
                  <Text style={styles.signText}>{userSign}</Text>
                </View>
                <Text style={[styles.vsText, { color: colors.accent }]}>+</Text>
                <View style={[styles.signBadge, { backgroundColor: colors.accentMuted }]}>
                  <Text style={styles.signText}>{selectedFriend.zodiac_sign}</Text>
                </View>
              </View>
              
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreValue, { color: colors.primary }]}>
                  {compatibility.score}%
                </Text>
                <Text style={[styles.scoreLabel, { color: colors.text.muted }]}>
                  Compatibility
                </Text>
              </View>
              
              <Text style={[styles.compatSummary, { color: colors.text.primary }]}>
                {compatibility.summary}
              </Text>
              
              <View style={styles.compatSection}>
                <Text style={[styles.sectionLabel, { color: colors.success }]}>
                  ✓ Strengths
                </Text>
                {compatibility.strengths.map((s, i) => (
                  <Text key={i} style={[styles.listItem, { color: colors.text.secondary }]}>
                    • {s}
                  </Text>
                ))}
              </View>
              
              <View style={styles.compatSection}>
                <Text style={[styles.sectionLabel, { color: colors.warning }]}>
                  ⚡ Growth Areas
                </Text>
                {compatibility.challenges.map((c, i) => (
                  <Text key={i} style={[styles.listItem, { color: colors.text.secondary }]}>
                    • {c}
                  </Text>
                ))}
              </View>
              
              <View style={[styles.adviceBox, { backgroundColor: colors.primaryMuted }]}>
                <Text style={[styles.adviceText, { color: colors.primary }]}>
                  💡 {compatibility.advice}
                </Text>
              </View>
            </Animated.View>
          )}
          
          {/* Friends list */}
          {friends.length === 0 ? (
            <Animated.View entering={FadeIn} style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                No friends yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.text.muted }]}>
                Add friends to check cosmic compatibility!
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowAddModal(true)}
              >
                <Ionicons name="add" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Add Friend</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            friends.map((friend, index) => (
              <Animated.View
                key={friend.id}
                entering={SlideInRight.delay(index * 100)}
              >
                <TouchableOpacity
                  style={[styles.friendCard, { backgroundColor: colors.bg.elevated }]}
                  onPress={() => viewCompatibility(friend)}
                  onLongPress={() => removeFriend(friend.id)}
                >
                  <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                      {friend.avatar_initial}
                    </Text>
                  </View>
                  <View style={styles.friendInfo}>
                    <Text style={[styles.friendName, { color: colors.text.primary }]}>
                      {friend.name}
                    </Text>
                    <Text style={[styles.friendSign, { color: colors.text.muted }]}>
                      ☉ {friend.zodiac_sign}
                    </Text>
                  </View>
                  <View style={styles.compatBadge}>
                    <Text style={[styles.compatValue, { color: colors.accent }]}>
                      {friend.compatibility_score || '?'}%
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </ScrollView>
        
        {/* Add friend modal */}
        {showAddModal && (
          <Animated.View entering={FadeIn} style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.bg.elevated }]}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Add Friend
              </Text>
              
              <TextInput
                style={[styles.input, { backgroundColor: colors.bg.muted, color: colors.text.primary }]}
                placeholder="Friend's name"
                placeholderTextColor={colors.text.muted}
                value={newFriendName}
                onChangeText={setNewFriendName}
              />
              
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Zodiac Sign
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.signPicker}>
                {ZODIAC_SIGNS.map(sign => (
                  <TouchableOpacity
                    key={sign}
                    style={[
                      styles.signOption,
                      { backgroundColor: newFriendSign === sign ? colors.primary : colors.bg.muted },
                    ]}
                    onPress={() => setNewFriendSign(sign)}
                  >
                    <Text style={[
                      styles.signOptionText,
                      { color: newFriendSign === sign ? '#FFF' : colors.text.secondary },
                    ]}>
                      {sign}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor: colors.border.default }]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={[styles.cancelText, { color: colors.text.secondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: colors.primary }]}
                  onPress={addFriend}
                >
                  <Text style={styles.confirmText}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  scroll: { flex: 1 },
  content: { padding: 16 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, marginBottom: 24 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '600' },
  friendInfo: { flex: 1, marginLeft: 12 },
  friendName: { fontSize: 16, fontWeight: '600' },
  friendSign: { fontSize: 14, marginTop: 2 },
  compatBadge: { marginRight: 8 },
  compatValue: { fontSize: 16, fontWeight: '700' },
  compatibilityCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  closeButton: { position: 'absolute', top: 12, right: 12, zIndex: 1 },
  compatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  signBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  signText: { fontSize: 15, fontWeight: '600' },
  vsText: { fontSize: 20, fontWeight: '700' },
  scoreContainer: { alignItems: 'center', marginBottom: 16 },
  scoreValue: { fontSize: 48, fontWeight: '700' },
  scoreLabel: { fontSize: 14 },
  compatSummary: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  compatSection: { marginBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  listItem: { fontSize: 14, marginBottom: 4, marginLeft: 8 },
  adviceBox: { padding: 16, borderRadius: 12 },
  adviceText: { fontSize: 14, lineHeight: 20 },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: { borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  label: { fontSize: 14, marginBottom: 8 },
  signPicker: { marginBottom: 20 },
  signOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  signOptionText: { fontSize: 14, fontWeight: '500' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '500' },
  confirmButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  confirmText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
