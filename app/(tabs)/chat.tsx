/**
 * CHAT SCREEN - ULTRA SIMPLE
 * Minimal dependencies to avoid crashes
 */
import { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUPABASE_URL = 'https://ennlryjggdoljgbqhttb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubmxyeWpnZ2RvbGpnYnFodHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Nzg3ODMsImV4cCI6MjA4NTA1NDc4M30.FOlCuYFogxXTdvgUTMw7Em4-dn2ANRRAHdf6WeJi3yY';

export default function ChatScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON}`,
        },
        body: JSON.stringify({ message: text, userData: { name: 'Friend', sunSign: 'Aries' } }),
      });
      const data = await res.json();
      const aiMsg: Message = { id: (Date.now()+1).toString(), role: 'assistant', content: data.response || 'The stars are quiet...' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const errMsg: Message = { id: (Date.now()+1).toString(), role: 'assistant', content: 'Unable to connect. Try again.' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🔮</Text>
          <Text style={styles.headerTitle}>Ask Veya</Text>
        </View>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.msgContent}>
          {messages.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>✨</Text>
              <Text style={styles.emptyText}>Ask me anything about your stars...</Text>
              <TouchableOpacity style={styles.quickBtn} onPress={() => sendMessage("What does today hold for me?")}>
                <Text style={styles.quickText}>What does today hold for me?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickBtn} onPress={() => sendMessage("Tell me about love")}>
                <Text style={styles.quickText}>Tell me about love</Text>
              </TouchableOpacity>
            </View>
          ) : (
            messages.map(msg => (
              <View key={msg.id} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={styles.bubbleText}>{msg.content}</Text>
              </View>
            ))
          )}
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#8B5CF6" />
              <Text style={styles.loadingText}>Consulting the stars...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask the cosmos..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)} disabled={!input.trim() || loading}>
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
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  headerIcon: { fontSize: 28 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  messages: { flex: 1 },
  msgContent: { padding: 16, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
  quickBtn: { backgroundColor: 'rgba(139,92,246,0.15)', borderRadius: 12, padding: 14, marginBottom: 12, width: '100%' },
  quickText: { color: '#A78BFA', fontSize: 15, textAlign: 'center' },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#8B5CF6' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)' },
  bubbleText: { color: '#FFF', fontSize: 15, lineHeight: 22 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, color: '#FFF', fontSize: 16, maxHeight: 100 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
});
