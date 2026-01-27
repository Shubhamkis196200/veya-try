import { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Animated, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// AI Response generator based on question type
const generateResponse = (question: string): string => {
  const q = question.toLowerCase();
  
  // Love related
  if (q.includes('love') || q.includes('relationship') || q.includes('partner') || q.includes('dating')) {
    const responses = [
      "The stars show Venus in a favorable position for your love life. This is a time of emotional openness and deeper connections. If single, the universe is aligning opportunities - stay open to unexpected encounters. If in a relationship, communication flows more naturally now. Express your feelings without fear.",
      "Your heart chakra is particularly active this week. The cosmic energies support vulnerability and authentic expression. A significant conversation about feelings may arise. Trust the process - what's meant for you will not pass you by.",
      "The Moon's current phase emphasizes emotional healing in relationships. Old patterns may surface for release. This is a cleansing period. After this transit, you'll feel lighter and more ready for deep connection.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Career related
  if (q.includes('career') || q.includes('job') || q.includes('work') || q.includes('business') || q.includes('money')) {
    const responses = [
      "Jupiter's influence on your career sector brings expansion and opportunity. This is an excellent time for bold moves - presenting ideas, asking for promotions, or starting new ventures. Your professional instincts are sharp. Trust them.",
      "Saturn reminds you that sustainable success requires patience. The foundation you're building now will support long-term achievements. Don't rush the process. Focus on skill-building and relationship-nurturing at work.",
      "Mercury's current position enhances your communication at work. Negotiations, presentations, and important conversations are favored. Your ideas will be received well. Speak up with confidence.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Today/General
  if (q.includes('today') || q.includes('day') || q.includes('now')) {
    const responses = [
      "Today's cosmic weather brings clarity and motivation. The Sun's energy supports your personal power. You'll find it easier to make decisions and take action. Honor your needs while remaining open to others' perspectives. A small act of kindness could create unexpected ripples.",
      "The current planetary alignment suggests a day of reflection and planning. While external action may feel slower, internal processing is accelerated. Use this energy for journaling, meditation, or organizing your thoughts. Tomorrow will bring more outward momentum.",
      "Today carries transformative energy. Something that seemed stuck may suddenly shift. Stay flexible and trust the timing. The universe is rearranging circumstances in your favor, even if it doesn't look like it at first.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Health
  if (q.includes('health') || q.includes('energy') || q.includes('tired') || q.includes('wellness')) {
    const responses = [
      "Your vitality is connected to the current lunar cycle. As the Moon waxes, your energy naturally increases. Honor your body's rhythms - rest when tired, move when energized. Hydration and grounding practices are especially beneficial now.",
      "Mars in your wellness sector calls for balanced action. Physical movement will boost your mood and clarity, but avoid pushing too hard. Listen to your body's signals. Consider trying a new form of exercise that also nurtures your spirit.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Gem related
  if (q.includes('gem') || q.includes('crystal') || q.includes('stone') || q.includes('wear')) {
    const responses = [
      "Based on your current cosmic alignment, Citrine would be highly beneficial. It resonates with your solar plexus chakra and amplifies your natural confidence and manifestation abilities. Wear it close to your heart or keep it in your workspace.",
      "The stars suggest working with Amethyst during this period. Its calming energy will help you navigate any emotional turbulence and enhance your intuition. Place it under your pillow for meaningful dreams.",
      "Clear Quartz is your cosmic ally right now. It amplifies whatever intention you set and brings clarity to confusion. Program it with your goal and carry it with you.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Default cosmic guidance
  const defaults = [
    "The universe speaks through synchronicities. Pay attention to recurring numbers, unexpected encounters, and dreams. Your higher self is communicating guidance. Trust your intuition - it's more accurate than you realize.",
    "You're in a period of spiritual acceleration. Old limitations are dissolving as new possibilities emerge. Stay grounded while reaching for growth. Balance is key. The answers you seek are already within you.",
    "The cosmic currents support your evolution right now. Release what no longer serves you to make space for what's coming. This is a powerful time for intention-setting. Write down your dreams - the stars are listening.",
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
};

const suggestedQuestions = [
  "What does today hold for me?",
  "How is my love life looking?",
  "Career guidance for this week",
  "What gem should I wear?",
];

export default function ChatScreen() {
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

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
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
          <Text style={styles.subtitle}>Your personal cosmic guide</Text>
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
                Get personalized cosmic guidance based on your unique profile
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
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
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

  // Messages
  messagesContainer: { flex: 1 },
  messagesContent: { padding: SPACING.lg, paddingBottom: SPACING.xl },

  // Empty State
  emptyState: { alignItems: 'center', paddingTop: SPACING.xxl },
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

  // Suggestions
  suggestions: { width: '100%', gap: SPACING.sm },
  suggestionCard: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: { ...FONTS.body, color: COLORS.textPrimary },

  // Message Bubbles
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

  // Typing Indicator
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
  },

  // Input
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
