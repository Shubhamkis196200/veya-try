import { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Animated, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores';
import { chatWithVeya } from '../../src/services/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What does today hold for me?",
  "How is my love life looking?",
  "Career guidance for this week",
  "What crystal should I use?",
  "Is this a good time for new beginnings?",
  "How can I improve my energy?",
];

export default function ChatScreen() {
  const { profile } = useAuthStore();
  const zodiacSign = profile?.sun_sign || profile?.zodiac_sign || 'Aries';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(typingAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get AI response
      const response = await chatWithVeya(text, zodiacSign);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'The cosmic connection is temporarily disrupted. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ask Veya</Text>
          <Text style={styles.subtitle}>Your personal cosmic guide • {zodiacSign}</Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="sparkles" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>Ask anything</Text>
              <Text style={styles.emptySubtitle}>
                Get personalized cosmic guidance based on your unique birth chart
              </Text>

              {/* Suggested Questions */}
              <View style={styles.suggestions}>
                {suggestedQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionCard}
                    onPress={() => sendMessage(question)}
                  >
                    <Text style={styles.suggestionText}>{question}</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  {message.role === 'assistant' && (
                    <View style={styles.assistantAvatar}>
                      <Ionicons name="sparkles" size={16} color={COLORS.primary} />
                    </View>
                  )}
                  <View style={[
                    styles.bubbleContent,
                    message.role === 'user' ? styles.userBubbleContent : styles.assistantBubbleContent,
                  ]}>
                    <Text style={[
                      styles.messageText,
                      message.role === 'user' && styles.userMessageText,
                    ]}>
                      {message.content}
                    </Text>
                  </View>
                </View>
              ))}

              {isTyping && (
                <View style={[styles.messageBubble, styles.assistantBubble]}>
                  <View style={styles.assistantAvatar}>
                    <Ionicons name="sparkles" size={16} color={COLORS.primary} />
                  </View>
                  <View style={[styles.bubbleContent, styles.assistantBubbleContent, styles.typingBubble]}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Text style={styles.typingText}>Consulting the stars...</Text>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask the cosmos..."
              placeholderTextColor={COLORS.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={input.trim() ? COLORS.textInverse : COLORS.textMuted} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  header: { padding: SPACING.lg, paddingBottom: SPACING.md },
  title: { ...FONTS.h1, color: COLORS.textPrimary },
  subtitle: { ...FONTS.body, color: COLORS.textMuted, marginTop: SPACING.xs },

  messagesContainer: { flex: 1 },
  messagesContent: { padding: SPACING.lg, paddingBottom: SPACING.xl },

  emptyState: { alignItems: 'center', paddingTop: SPACING.xl },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: { ...FONTS.h2, color: COLORS.textPrimary, marginBottom: SPACING.xs },
  emptySubtitle: { 
    ...FONTS.body, 
    color: COLORS.textMuted, 
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },

  suggestions: { width: '100%', gap: SPACING.sm },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: { ...FONTS.body, color: COLORS.textPrimary, flex: 1 },

  messageBubble: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  userBubble: { justifyContent: 'flex-end' },
  assistantBubble: { justifyContent: 'flex-start' },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  bubbleContent: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  userBubbleContent: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubbleContent: {
    backgroundColor: COLORS.backgroundCard,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: { ...FONTS.body, color: COLORS.textPrimary, lineHeight: 22 },
  userMessageText: { color: COLORS.textInverse },

  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  typingText: { ...FONTS.bodySmall, color: COLORS.textMuted },

  inputContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  input: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
    maxHeight: 100,
    paddingVertical: SPACING.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.backgroundMuted,
  },
});
