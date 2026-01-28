/**
 * VOICE INPUT HOOK
 * Real speech-to-text for chat input using expo-speech-recognition
 * With safe error handling for Expo Go
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Safe import with fallback
let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: any = () => {};

try {
  const speechModule = require('expo-speech-recognition');
  ExpoSpeechRecognitionModule = speechModule.ExpoSpeechRecognitionModule;
  useSpeechRecognitionEvent = speechModule.useSpeechRecognitionEvent;
} catch (e) {
  console.warn('expo-speech-recognition not available');
}

interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  partialTranscript: string;
  error: string | null;
  isAvailable: boolean;
}

export function useVoiceInput() {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    partialTranscript: '',
    error: null,
    isAvailable: !!ExpoSpeechRecognitionModule,
  });

  // Track if we've requested permission
  const permissionRequested = useRef(false);

  // Safe event handlers - only register if module exists
  useEffect(() => {
    if (!ExpoSpeechRecognitionModule) return;
    
    // Events are handled via useSpeechRecognitionEvent if available
  }, []);

  // Handle speech recognition results - wrapped in try/catch
  try {
    useSpeechRecognitionEvent('result', (event: any) => {
      const resultIndex = event.resultIndex ?? 0;
      const result = event.results?.[resultIndex];
      if (result) {
        const firstResult = Array.isArray(result) ? result[0] : result;
        const text = firstResult?.transcript || '';
        const isFinal = firstResult?.isFinal ?? result?.isFinal ?? false;
        
        if (isFinal) {
          setState(prev => ({
            ...prev,
            transcript: text,
            partialTranscript: '',
          }));
        } else {
          setState(prev => ({
            ...prev,
            partialTranscript: text,
          }));
        }
      }
    });

    useSpeechRecognitionEvent('error', (event: any) => {
      console.error('Speech recognition error:', event?.error);
      let errorMessage = 'Voice recognition failed';
      
      switch (event?.error) {
        case 'not-allowed':
          errorMessage = 'Microphone permission denied';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected';
          break;
        case 'network':
          errorMessage = 'Network error';
          break;
      }
      
      setState(prev => ({
        ...prev,
        isListening: false,
        error: errorMessage,
      }));
    });

    useSpeechRecognitionEvent('end', () => {
      setState(prev => ({ ...prev, isListening: false }));
    });

    useSpeechRecognitionEvent('start', () => {
      setState(prev => ({ 
        ...prev, 
        isListening: true, 
        error: null,
        partialTranscript: '',
      }));
    });
  } catch (e) {
    console.warn('Speech recognition events not available');
  }

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    if (!ExpoSpeechRecognitionModule) return false;
    try {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      return result.granted;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  // Start listening
  const startListening = useCallback(async () => {
    if (!ExpoSpeechRecognitionModule) {
      setState(prev => ({ ...prev, error: 'Voice not available', isAvailable: false }));
      return;
    }

    try {
      // Request permission if not already done
      if (!permissionRequested.current) {
        const hasPermission = await requestPermissions();
        permissionRequested.current = true;
        if (!hasPermission) {
          setState(prev => ({ ...prev, error: 'Microphone permission denied' }));
          return;
        }
      }

      // Clear previous state
      setState(prev => ({ 
        ...prev, 
        transcript: '',
        partialTranscript: '',
        error: null,
      }));

      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Start recognition
      await ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
        requiresOnDeviceRecognition: false,
        addsPunctuation: true,
      });
    } catch (error) {
      console.error('Start listening error:', error);
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        error: 'Failed to start voice input',
      }));
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(async () => {
    if (!ExpoSpeechRecognitionModule) return;
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error('Stop listening error:', error);
    }
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', partialTranscript: '' }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    isListening: state.isListening,
    transcript: state.transcript,
    partialTranscript: state.partialTranscript,
    error: state.error,
    voiceAvailable: state.isAvailable,
    startListening,
    stopListening,
    clearTranscript,
    clearError,
  };
}

export default useVoiceInput;
