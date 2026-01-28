/**
 * CHAT SCREEN - SIMPLIFIED
 * Clean AI chat without complex voice input
 */
import { useState, useRef, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useUserStore } from '../../src/stores';
import { sendMessage } from '../../src/services/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  "What does today hold for me?",
  "Love life insights",
  "Career guidance",
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useUserStore();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userName = profile?.name || 'friend';
  const sunSign = profile?.sunSign || 'Aries';

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Scroll to bottom
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await sendMessage(text, userName, sunSign);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'The stars are unclear right now. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [isLoading, userName, sunSign]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🔮</Text>
          <View>
            <Text style={styles.headerTitle}>Veya</Text>
            <Text style={styles.headerSubtitle}>Your cosmic guide</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[styles.messagesContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <Animated.View entering={FadeIn.duration(500)} style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔮</Text>
              <Text style={styles.emptyTitle}>Ask the cosmos</Text>
              <Text style={styles.emptySubtitle}>What would you like to know, {userName}?</Text>
              
              {/* Quick prompts */}
              <View style={styles.quickPrompts}>
                {QUICK_PROMPTS.map((prompt, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.promptButton}
                    onPress={() => handleSend(prompt)}
                  >
                    <Text style={styles.promptText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ) : (
            messages.map((msg, i) => (
              <Animated.View
                key={msg.id}
                entering={FadeInDown.delay(i * 50).duration(300)}
                style={[
                  styles.messageBubble,
                  msg.role === 'user' ? styles.userBubble : styles.assistantBubble
                ]}
              >
                <Text style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : styles.assistantText
                ]}>
                  {msg.content}
                </Text>
              </Animated.View>
            ))
          )}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#8B5CF6" />
              <Text style={styles.loadingText}>Consulting the stars...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputWrapper}
        >
          <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask the cosmos..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
            >
              <LinearGradient
                colors={input.trim() ? ['#8B5CF6', '#A78BFA'] : ['#333', '#222']}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  headerEmoji: { fontSize: 32 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, gap: 12 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
  quickPrompts: { gap: 12, width: '100%', paddingHorizontal: 20 },
  promptButton: { backgroundColor: 'rgba(139,92,246,0.15)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)' },
  promptText: { color: '#A78BFA', fontSize: 15, textAlign: 'center' },
  messageBubble: { maxWidth: '85%', borderRadius: 16, padding: 14 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#8B5CF6' },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)' },
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFF' },
  assistantText: { color: 'rgba(255,255,255,0.9)' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  loadingText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  inputWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  inputContainer: { flexDirection: 'row', padding: 12, gap: 10, backgroundColor: 'rgba(10,10,20,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 12, fontSize: 16, color: '#FFF', maxHeight: 100 },
  sendButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sendButtonDisabled: { opacity: 0.5 },
});
