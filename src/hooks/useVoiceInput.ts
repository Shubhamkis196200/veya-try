/**
 * VOICE INPUT HOOK
 * Real speech-to-text for chat input using expo-speech-recognition
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

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
    isAvailable: true,
  });

  // Track if we've requested permission
  const permissionRequested = useRef(false);

  // Handle speech recognition results
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

  // Handle speech recognition errors
  useSpeechRecognitionEvent('error', (event) => {
    console.error('Speech recognition error:', event.error);
    let errorMessage = 'Voice recognition failed';
    
    switch (event.error) {
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  });

  // Handle speech recognition end
  useSpeechRecognitionEvent('end', () => {
    setState(prev => ({ ...prev, isListening: false }));
  });

  // Handle speech recognition start
  useSpeechRecognitionEvent('start', () => {
    setState(prev => ({ 
      ...prev, 
      isListening: true, 
      error: null,
      partialTranscript: '',
    }));
  });

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      return result.granted;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  // Check availability
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const services = await ExpoSpeechRecognitionModule.getSupportedLocales({});
        setState(prev => ({ 
          ...prev, 
          isAvailable: services.locales.length > 0 
        }));
      } catch (error) {
        setState(prev => ({ ...prev, isAvailable: false }));
      }
    };
    checkAvailability();
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    // Clear any previous transcript
    setState(prev => ({ 
      ...prev, 
      transcript: '', 
      partialTranscript: '',
      error: null,
    }));

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setState(prev => ({ ...prev, error: 'Microphone permission denied' }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
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
        error: 'Failed to start voice recognition',
        isListening: false,
      }));
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error('Stop listening error:', error);
    }
  }, []);

  // Cancel listening (abort without result)
  const cancelListening = useCallback(async () => {
    try {
      await ExpoSpeechRecognitionModule.abort();
      setState(prev => ({
        ...prev,
        isListening: false,
        partialTranscript: '',
      }));
    } catch (error) {
      console.error('Cancel listening error:', error);
    }
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      transcript: '', 
      partialTranscript: '',
      error: null,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        ExpoSpeechRecognitionModule.abort();
      } catch {}
    };
  }, []);

  return {
    isListening: state.isListening,
    transcript: state.transcript,
    partialTranscript: state.partialTranscript,
    error: state.error,
    isAvailable: state.isAvailable,
    startListening,
    stopListening,
    cancelListening,
    clearTranscript,
  };
}

export default useVoiceInput;
