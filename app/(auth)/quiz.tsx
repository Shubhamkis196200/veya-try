/**
 * COSMIC PERSONALITY QUIZ
 * Engaging onboarding step to increase completion
 */
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { StarField } from '../../src/components';

const { width } = Dimensions.get('window');

const QUIZ_QUESTIONS = [
  {
    question: "When making decisions, you tend to...",
    options: [
      { text: "Trust your gut feeling", icon: "flash", value: "intuitive" },
      { text: "Analyze all the facts", icon: "analytics", value: "analytical" },
      { text: "Ask friends for advice", icon: "people", value: "social" },
      { text: "Go with the flow", icon: "water", value: "adaptable" },
    ],
  },
  {
    question: "Your ideal weekend looks like...",
    options: [
      { text: "Adventure & exploration", icon: "compass", value: "adventurous" },
      { text: "Cozy time at home", icon: "home", value: "homebody" },
      { text: "Socializing with friends", icon: "wine", value: "social" },
      { text: "Self-care & reflection", icon: "leaf", value: "introspective" },
    ],
  },
  {
    question: "What draws you to astrology?",
    options: [
      { text: "Understanding myself better", icon: "person", value: "self" },
      { text: "Improving relationships", icon: "heart", value: "love" },
      { text: "Career & life guidance", icon: "briefcase", value: "career" },
      { text: "Curiosity about the cosmos", icon: "planet", value: "curious" },
    ],
  },
  {
    question: "How do you handle challenges?",
    options: [
      { text: "Face them head-on", icon: "flame", value: "fire" },
      { text: "Take time to plan", icon: "map", value: "earth" },
      { text: "Talk it through", icon: "chatbubbles", value: "air" },
      { text: "Trust the process", icon: "water", value: "water" },
    ],
  },
];

export default function QuizScreen() {
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  
  const question = QUIZ_QUESTIONS[currentQ];
  const progress = (currentQ + 1) / QUIZ_QUESTIONS.length;
  
  const handleAnswer = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Quiz complete - save answers and continue
      router.push('/(auth)/data-input');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.bg.primary }]}>
      <LinearGradient
        colors={colors.gradient.cosmic}
        style={StyleSheet.absoluteFill}
      />
      <StarField starCount={40} />
      
      <SafeAreaView style={styles.safe}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBg, { backgroundColor: colors.bg.muted }]}>
            <Animated.View
              style={[
                styles.progressFill,
                { 
                  backgroundColor: colors.primary,
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.text.secondary }]}>
            {currentQ + 1} of {QUIZ_QUESTIONS.length}
          </Text>
        </View>
        
        {/* Question */}
        <Animated.View
          key={currentQ}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={styles.questionContainer}
        >
          <Text style={[styles.question, { color: colors.text.primary }]}>
            {question.question}
          </Text>
          
          {/* Options */}
          <View style={styles.options}>
            {question.options.map((option, index) => (
              <Animated.View
                key={option.value}
                entering={FadeInDown.delay(index * 100).duration(400)}
              >
                <TouchableOpacity
                  style={[
                    styles.option,
                    {
                      backgroundColor: colors.bg.elevated,
                      borderColor: colors.border.default,
                    },
                  ]}
                  onPress={() => handleAnswer(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionIcon, { backgroundColor: colors.primaryMuted }]}>
                    <Ionicons name={option.icon as any} size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.optionText, { color: colors.text.primary }]}>
                    {option.text}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
        
        {/* Skip */}
        <TouchableOpacity
          style={styles.skip}
          onPress={() => router.push('/(auth)/data-input')}
        >
          <Text style={[styles.skipText, { color: colors.text.muted }]}>
            Skip quiz
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
  },
  question: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 34,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  skip: {
    padding: 16,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
  },
});
