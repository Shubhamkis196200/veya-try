/**
 * CHAT SCREEN - WITH VOICE INPUT
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Dimensions, Keyboard, ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, FadeInDown, SlideInRight, SlideInLeft,
  useAnimatedStyle, useSharedValue, withRepeat, 
  withSequence, withTiming, withSpring, Easing,
  interpolateColor, cancelAnimation
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../src/stores';
import { chat } from '../../src/services/ai';
import { useVoiceInput } from '../../src/hooks/useVoiceInput';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "What does today hold for me?",
  "Love life insights",
  "Career guidance",
  "Who am I compatible with?",
];

function TypingIndicator() {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <ActivityIndicator size="small" color="#8B7FD9" />
        <Text style={styles.typingText}>Veya is consulting the stars...</Text>
      </View>
    </View>
  );
}

// Animated Mic Button Component
function MicButton({ 
  isListening, 
  onPress, 
  disabled 
}: { 
  isListening: boolean; 
  onPress: () => void; 
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const ringScale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    if (isListening) {
      // Pulsing scale animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // Glow animation
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      );

      // Expanding ring animation
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(2.5, { duration: 1200, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );

      // Color transition
      colorProgress.value = withTiming(1, { duration: 300 });
    } else {
      // Stop animations
      cancelAnimation(scale);
      cancelAnimation(glowOpacity);
      cancelAnimation(ringScale);
      
      scale.value = withSpring(1);
      glowOpacity.value = withTiming(0, { duration: 200 });
      ringScale.value = 1;
      colorProgress.value = withTiming(0, { duration: 300 });
    }
  }, [isListening]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isListening ? 0.4 : 0, { duration: 300 }),
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={styles.micButtonContainer}
    >
      {/* Expanding ring effect */}
      <Animated.View style={[styles.micRing, ringStyle]} />
      
      {/* Glow effect */}
      <Animated.View style={[styles.micGlow, glowStyle]} />
      
      {/* Main button */}
      <Animated.View style={[styles.micButton, buttonStyle, disabled && styles.micButtonDisabled]}>
        <LinearGradient
          colors={isListening ? ['#EF4444', '#DC2626'] : ['#6366F1', '#8B5CF6']}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons 
          name={isListening ? 'stop' : 'mic'} 
          size={22} 
          color="#FFF" 
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

// Voice Status Indicator
function VoiceStatusIndicator({ 
  isListening, 
  partialTranscript,
  error 
}: { 
  isListening: boolean; 
  partialTranscript: string;
  error: string | null;
}) {
  if (!isListening && !partialTranscript && !error) return null;

  return (
    <Animated.View 
      entering={FadeIn.duration(200)} 
      style={styles.voiceStatusContainer}
    >
      {error ? (
        <View style={styles.voiceStatusError}>
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text style={styles.voiceStatusErrorText}>{error}</Text>
        </View>
      ) : isListening ? (
        <View style={styles.voiceStatusListening}>
          <View style={styles.listeningDots}>
            <Animated.View style={[styles.listeningDot, { animationDelay: '0ms' }]} />
            <Animated.View style={[styles.listeningDot, { animationDelay: '150ms' }]} />
            <Animated.View style={[styles.listeningDot, { animationDelay: '300ms' }]} />
          </View>
          <Text style={styles.voiceStatusText}>
            {partialTranscript || 'Listening...'}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useAuthStore();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Voice input hook
  const { 
    isListening, 
    transcript, 
    partialTranscript,
    error: voiceError,
    isAvailable: voiceAvailable,
    startListening, 
    stopListening,
    clearTranscript,
  } = useVoiceInput();
  
  const zodiacSign = profile?.sun_sign || profile?.zodiac_sign || 'Aries';
  const userName = profile?.name?.split(' ')[0] || 'Stargazer';

  // Handle keyboard
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  // Auto-fill input when transcript is ready
  useEffect(() => {
    if (transcript) {
      setInput(prev => {
        // Append to existing text with space, or just set it
        const newText = prev.trim() ? `${prev.trim()} ${transcript}` : transcript;
        return newText;
      });
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleMicPress = useCallback(async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    // Stop voice input if active
    if (isListening) {
      await stopListening();
    }
    
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
      const response = await chat(text, zodiacSign, userName, {
        birthDate: profile?.birth_date,
        birthTime: profile?.birth_time,
        birthLocation: profile?.birth_location,
        moonSign: profile?.moon_sign,
        risingSign: profile?.rising_sign,
        method: profile?.fortune_method,
        intent: profile?.intent,
      });
      
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
        content: '🌙 The cosmic connection flickered. Please try again...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>🔮</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Veya</Text>
            <Text style={styles.headerSubtitle}>Your cosmic guide • {zodiacSign}</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: keyboardHeight > 0 ? 20 : 180 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <Animated.View entering={FadeIn.duration(500)} style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔮</Text>
              <Text style={styles.emptyTitle}>Ask me anything</Text>
              <Text style={styles.emptySubtitle}>I'm here to guide you through the cosmic energies</Text>
              
              {voiceAvailable && (
                <View style={styles.voiceHint}>
                  <Ionicons name="mic-outline" size={16} color="rgba(139,127,217,0.8)" />
                  <Text style={styles.voiceHintText}>Tap the mic to speak your question</Text>
                </View>
              )}
              
              <View style={styles.promptsGrid}>
                {QUICK_PROMPTS.map((prompt, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.promptChip}
                    onPress={() => sendMessage(prompt)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.promptText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ) : (
            <>
              {messages.map((msg, index) => (
                <Animated.View
                  key={msg.id}
                  entering={msg.role === 'user' ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
                  style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}
                >
                  <Text style={[styles.messageText, msg.role === 'user' && styles.userText]}>
                    {msg.content}
                  </Text>
                </Animated.View>
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
        </ScrollView>

        {/* Input Area - Fixed at bottom */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          style={styles.inputWrapper}
        >
          <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 20) + 80 }]}>
            {/* Voice Status */}
            <VoiceStatusIndicator 
              isListening={isListening} 
              partialTranscript={partialTranscript}
              error={voiceError}
            />
            
            <View style={styles.inputRow}>
              {/* Voice Input Button */}
              {voiceAvailable && (
                <MicButton 
                  isListening={isListening}
                  onPress={handleMicPress}
                  disabled={isTyping}
                />
              )}
              
              <TextInput
                style={[styles.input, isListening && styles.inputListening]}
                value={input}
                onChangeText={setInput}
                placeholder={isListening ? 'Listening...' : 'Ask the cosmos...'}
                placeholderTextColor={isListening ? 'rgba(139,127,217,0.6)' : 'rgba(255,255,255,0.3)'}
                multiline
                maxLength={500}
                onSubmitEditing={() => sendMessage(input)}
                blurOnSubmit={false}
                editable={!isListening}
              />
              
              <TouchableOpacity
                style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                onPress={() => sendMessage(input)}
                disabled={!input.trim() || isTyping || isListening}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={input.trim() ? ['#A78BFA', '#8B5CF6'] : ['#333', '#222']}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(139,127,217,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerEmoji: { fontSize: 24 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 24, fontWeight: '600', color: '#FFF', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center', paddingHorizontal: 40 },
  voiceHint: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 6, backgroundColor: 'rgba(139,127,217,0.1)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  voiceHintText: { fontSize: 13, color: 'rgba(139,127,217,0.8)' },
  promptsGrid: { marginTop: 32, width: '100%' },
  promptChip: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  promptText: { color: 'rgba(255,255,255,0.7)', fontSize: 15, textAlign: 'center' },
  messageBubble: { maxWidth: '85%', padding: 14, borderRadius: 18, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#8B5CF6', borderBottomRightRadius: 4 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.9)' },
  userText: { color: '#FFF' },
  typingContainer: { alignSelf: 'flex-start', marginBottom: 12 },
  typingBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 16, gap: 8 },
  typingText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  inputWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  inputContainer: { padding: 12, backgroundColor: 'rgba(10,10,20,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 12, fontSize: 16, color: '#FFF', maxHeight: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  inputListening: { borderColor: 'rgba(139,127,217,0.4)', backgroundColor: 'rgba(139,127,217,0.1)' },
  sendButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sendButtonDisabled: { opacity: 0.5 },
  
  // Mic Button Styles
  micButtonContainer: { position: 'relative', width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  micButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 2 },
  micButtonDisabled: { opacity: 0.5 },
  micGlow: { position: 'absolute', width: 64, height: 64, borderRadius: 32, backgroundColor: '#8B5CF6', zIndex: 1 },
  micRing: { position: 'absolute', width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#EF4444', zIndex: 0 },
  
  // Voice Status Styles
  voiceStatusContainer: { marginBottom: 10 },
  voiceStatusListening: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(139,127,217,0.15)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, gap: 10 },
  voiceStatusText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, flex: 1 },
  voiceStatusError: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.15)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, gap: 8 },
  voiceStatusErrorText: { color: '#EF4444', fontSize: 13 },
  listeningDots: { flexDirection: 'row', gap: 4 },
  listeningDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8B5CF6' },
});
