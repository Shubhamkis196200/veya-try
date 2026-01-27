/**
 * AI MEMORY SYSTEM
 * Using Mem0 patterns for conversation memory
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

interface Memory {
  id: string;
  userId: string;
  type: 'fact' | 'preference' | 'topic' | 'emotion';
  content: string;
  context?: string;
  createdAt: string;
  relevance: number;
}

interface ConversationContext {
  recentTopics: string[];
  userMood: string;
  lastInteraction: string;
  preferences: Record<string, string>;
}

const MEMORY_KEY = 'veya_memory';
const CONTEXT_KEY = 'veya_context';

// Extract memories from conversation
function extractMemories(message: string, response: string): Partial<Memory>[] {
  const memories: Partial<Memory>[] = [];
  
  // Extract topics mentioned
  const topicPatterns = [
    /(?:my|about my) (relationship|job|career|family|health|love life)/gi,
    /(?:I'm|I am) (worried|excited|anxious|happy|sad|confused) about/gi,
    /(?:I have|I've got) (?:a|an) (partner|boyfriend|girlfriend|wife|husband)/gi,
  ];
  
  topicPatterns.forEach(pattern => {
    const matches = message.matchAll(pattern);
    for (const match of matches) {
      memories.push({
        type: 'topic',
        content: match[1].toLowerCase(),
        context: message.slice(0, 100),
      });
    }
  });
  
  // Extract preferences
  if (message.toLowerCase().includes('i prefer') || message.toLowerCase().includes('i like')) {
    memories.push({
      type: 'preference',
      content: message,
      context: 'stated preference',
    });
  }
  
  // Extract emotional states
  const emotionWords = ['worried', 'anxious', 'excited', 'happy', 'sad', 'confused', 'stressed'];
  emotionWords.forEach(emotion => {
    if (message.toLowerCase().includes(emotion)) {
      memories.push({
        type: 'emotion',
        content: emotion,
        context: message.slice(0, 100),
      });
    }
  });
  
  return memories;
}

// Memory Manager Class
export class MemoryManager {
  private userId: string;
  private memories: Memory[] = [];
  private context: ConversationContext;
  
  constructor(userId: string) {
    this.userId = userId;
    this.context = {
      recentTopics: [],
      userMood: 'neutral',
      lastInteraction: new Date().toISOString(),
      preferences: {},
    };
  }
  
  // Load memories from storage
  async load(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(`${MEMORY_KEY}_${this.userId}`);
      if (stored) {
        this.memories = JSON.parse(stored);
      }
      
      const contextStored = await AsyncStorage.getItem(`${CONTEXT_KEY}_${this.userId}`);
      if (contextStored) {
        this.context = JSON.parse(contextStored);
      }
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  }
  
  // Save memories to storage
  async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${MEMORY_KEY}_${this.userId}`,
        JSON.stringify(this.memories)
      );
      await AsyncStorage.setItem(
        `${CONTEXT_KEY}_${this.userId}`,
        JSON.stringify(this.context)
      );
    } catch (error) {
      console.error('Failed to save memories:', error);
    }
  }
  
  // Add new memory
  async addMemory(memory: Partial<Memory>): Promise<void> {
    const newMemory: Memory = {
      id: Date.now().toString(),
      userId: this.userId,
      type: memory.type || 'fact',
      content: memory.content || '',
      context: memory.context,
      createdAt: new Date().toISOString(),
      relevance: 1,
    };
    
    // Check for duplicates
    const exists = this.memories.some(
      m => m.type === newMemory.type && m.content === newMemory.content
    );
    
    if (!exists) {
      this.memories.push(newMemory);
      await this.save();
    }
  }
  
  // Process conversation and extract memories
  async processConversation(userMessage: string, aiResponse: string): Promise<void> {
    const extracted = extractMemories(userMessage, aiResponse);
    
    for (const memory of extracted) {
      await this.addMemory(memory);
    }
    
    // Update context
    this.context.lastInteraction = new Date().toISOString();
    if (extracted.find(m => m.type === 'emotion')) {
      this.context.userMood = extracted.find(m => m.type === 'emotion')?.content || 'neutral';
    }
    if (extracted.find(m => m.type === 'topic')) {
      const topic = extracted.find(m => m.type === 'topic')?.content;
      if (topic && !this.context.recentTopics.includes(topic)) {
        this.context.recentTopics = [topic, ...this.context.recentTopics].slice(0, 5);
      }
    }
    
    await this.save();
  }
  
  // Get relevant memories for a query
  getRelevantMemories(query: string, limit = 5): Memory[] {
    const queryLower = query.toLowerCase();
    
    // Score memories by relevance
    const scored = this.memories.map(memory => {
      let score = memory.relevance;
      
      // Boost if content matches query
      if (memory.content.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      
      // Boost recent memories
      const age = Date.now() - new Date(memory.createdAt).getTime();
      const daysSince = age / (1000 * 60 * 60 * 24);
      if (daysSince < 1) score += 1;
      else if (daysSince < 7) score += 0.5;
      
      return { memory, score };
    });
    
    // Sort by score and return top memories
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.memory);
  }
  
  // Get context for AI prompt
  getContextForPrompt(): string {
    const memories = this.memories.slice(-10);
    const topics = this.context.recentTopics.slice(0, 3);
    
    let context = '';
    
    if (this.context.userMood !== 'neutral') {
      context += `User seems ${this.context.userMood}. `;
    }
    
    if (topics.length > 0) {
      context += `Recently discussed: ${topics.join(', ')}. `;
    }
    
    const facts = memories.filter(m => m.type === 'fact');
    if (facts.length > 0) {
      context += `Known facts: ${facts.map(f => f.content).join('; ')}. `;
    }
    
    return context.trim();
  }
  
  // Clear all memories
  async clear(): Promise<void> {
    this.memories = [];
    this.context = {
      recentTopics: [],
      userMood: 'neutral',
      lastInteraction: new Date().toISOString(),
      preferences: {},
    };
    await this.save();
  }
}

// Singleton instance per user
const memoryInstances: Record<string, MemoryManager> = {};

export async function getMemoryManager(userId: string): Promise<MemoryManager> {
  if (!memoryInstances[userId]) {
    memoryInstances[userId] = new MemoryManager(userId);
    await memoryInstances[userId].load();
  }
  return memoryInstances[userId];
}

export default MemoryManager;
