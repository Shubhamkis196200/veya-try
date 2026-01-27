/**
 * CHAT SCREEN - IMPROVED
 * Voice input, quick replies, typing indicator, reactions, memory
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Dimensions, Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, FadeInDown, FadeInUp, SlideInRight, SlideInLeft,
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  Easing, withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { useVoiceInput } from '../../src/hooks/useVoiceInput';
import { VoiceButton } from '../../src/components/VoiceButton';
import { useAuthStore } from '../../src/stores';
import { chatWithVeya } from '../../src/services/ai';
import { getMemoryManager } from '../../src/lib/memory';
import { StarField } from '../../src/components';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reaction?: string;
}

const QUICK_PROMPTS = [
  "What does today hold for me?",
  "Love life insights",
  "Career guidance",
  "How's my energy today?",
];

const REACTIONS = ['✨', '💜', '🙏', '🔮'];

// Typing indicator component
function TypingIndicator() {
  const { colors } = useTheme();
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  
  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 400 })
      ),
      -1
    );
    dot2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 400 })
      ),
      -1
    );
    dot3.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 400 })
      ),
      -1
    );
  }, []);
  
  const dotStyle1 = useAnimatedStyle(() => ({ opacity: 0.3 + dot1.value * 0.7 }));
  const dotStyle2 = useAnimatedStyle(() => ({ opacity: 0.3 + dot2.value * 0.7 }));
  const dotStyle3 = useAnimatedStyle(() => ({ opacity: 0.3 + dot3.value * 0.7 }));
  
  return (
    <View style={[styles.typingContainer, { backgroundColor: colors.bg.tertiary }]}>
      <Text style={[styles.typingText, { color: colors.text.muted }]}>
        Veya is consulting the stars
      </Text>
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, dotStyle1]} />
        <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, dotStyle2]} />
        <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, dotStyle3]} />
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { colors, spacing, radius } = useTheme();
  const { profile } = useAuthStore();
  const zodiacSign = profile?.sun_sign || profile?.zodiac_sign || 'Aries';
  const userName = profile?.name?.split(' ')[0];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);
  
  // Send message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    scrollToBottom();
    
    try {
      // Get AI response with memory context
      const memoryManager = await getMemoryManager(profile?.id || 'guest');
      const response = await chatWithVeya(text, zodiacSign, userName);
      
      // Process conversation for memory
      await memoryManager.processConversation(text, response);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Hmm, the cosmic connection flickered for a moment. Let me try again... 🌙',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };
  
  // Add reaction to message
  const addReaction = (messageId: string, reaction: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId ? { ...m, reaction: m.reaction === reaction ? undefined : reaction } : m
      )
    );
    setSelectedMessage(null);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.bg.primary }]}>
      <LinearGradient colors={colors.gradient.cosmic} style={StyleSheet.absoluteFill} />
      <StarField starCount={20} />
      
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.default }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
              <Text style={styles.avatarEmoji}>✨</Text>
            </View>
            <View>
              <Text style={[styles.title, { color: colors.text.primary }]}>Veya</Text>
              <Text style={[styles.subtitle, { color: colors.text.muted }]}>
                Your cosmic guide • {zodiacSign}
              </Text>
            </View>
          </View>
          
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
          >
            {messages.length === 0 ? (
              <Animated.View entering={FadeIn} style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔮</Text>
                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                  Ask me anything
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.text.muted }]}>
                  I'm here to guide you through the cosmic energies
                </Text>
                
                {/* Quick prompts */}
                <View style={styles.quickPrompts}>
                  {QUICK_PROMPTS.map((prompt, index) => (
                    <Animated.View 
                      key={prompt}
                      entering={FadeInDown.delay(200 + index * 100)}
                    >
                      <TouchableOpacity
                        style={[styles.quickPrompt, { backgroundColor: colors.bg.elevated }]}
                        onPress={() => sendMessage(prompt)}
                      >
                        <Text style={[styles.quickPromptText, { color: colors.text.secondary }]}>
                          {prompt}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            ) : (
              <>
                {messages.map((message, index) => (
                  <Animated.View
                    key={message.id}
                    entering={message.role === 'user' ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setSelectedMessage(message.id);
                      }}
                      style={[
                        styles.messageBubble,
                        message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                        {
                          backgroundColor: message.role === 'user' 
                            ? colors.primary 
                            : colors.bg.elevated,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          {
                            color: message.role === 'user'
                              ? '#FFFFFF'
                              : colors.text.primary,
                          },
                        ]}
                      >
                        {message.content}
                      </Text>
                      
                      {message.reaction && (
                        <View style={styles.reactionBadge}>
                          <Text style={styles.reactionText}>{message.reaction}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    
                    {/* Reaction picker */}
                    {selectedMessage === message.id && (
                      <Animated.View 
                        entering={FadeIn.duration(200)}
                        style={[styles.reactionPicker, { backgroundColor: colors.bg.elevated }]}
                      >
                        {REACTIONS.map(reaction => (
                          <TouchableOpacity
                            key={reaction}
                            onPress={() => addReaction(message.id, reaction)}
                            style={styles.reactionButton}
                          >
                            <Text style={styles.reactionOption}>{reaction}</Text>
                          </TouchableOpacity>
                        ))}
                      </Animated.View>
                    )}
                  </Animated.View>
                ))}
                
                {isTyping && <TypingIndicator />}
              </>
            )}
          </ScrollView>
          
          {/* Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.bg.secondary }]}>
            <View style={[styles.inputWrapper, { backgroundColor: colors.bg.elevated }]}>
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                placeholder="Ask the cosmos..."
                placeholderTextColor={colors.text.muted}
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
                onSubmitEditing={() => sendMessage(input)}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: input.trim() ? colors.primary : colors.bg.muted },
                ]}
                onPress={() => sendMessage(input)}
                disabled={!input.trim()}
              >
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color={input.trim() ? '#FFFFFF' : colors.text.muted}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 22 },
  title: { fontSize: 18, fontWeight: '600' },
  subtitle: { fontSize: 13 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 20 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, textAlign: 'center', marginBottom: 32 },
  quickPrompts: { width: '100%', gap: 8 },
  quickPrompt: { padding: 14, borderRadius: 12 },
  quickPromptText: { fontSize: 15 },
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
    marginVertical: 4,
  },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  assistantBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 22 },
  reactionBadge: {
    position: 'absolute',
    bottom: -8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reactionText: { fontSize: 14 },
  reactionPicker: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: 20,
    padding: 4,
    marginTop: 4,
  },
  reactionButton: { padding: 8 },
  reactionOption: { fontSize: 20 },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    gap: 8,
  },
  typingText: { fontSize: 14 },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  inputContainer: { padding: 12, paddingBottom: 24 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  input: { flex: 1, fontSize: 16, maxHeight: 100, paddingVertical: 10 },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
