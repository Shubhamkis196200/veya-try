/**
 * VOICE INPUT HOOK
 * Speech-to-text for chat input
 */
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

// Note: For production, use a proper speech-to-text API like:
// - Google Cloud Speech-to-Text
// - AWS Transcribe
// - Whisper API
// This is a placeholder that simulates the UI flow

export function useVoiceInput() {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    error: null,
  });
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  // Start listening
  const startListening = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setState(prev => ({ ...prev, error: 'Microphone permission denied' }));
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setState(prev => ({ ...prev, isListening: true, error: null }));
      
    } catch (error) {
      console.error('Start listening error:', error);
      setState(prev => ({ ...prev, error: 'Failed to start recording' }));
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(async () => {
    if (!recording) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      setRecording(null);
      setState(prev => ({ ...prev, isListening: false }));

      // In production, send audio to speech-to-text API
      // For now, return a placeholder message
      if (uri) {
        // Simulate transcription delay
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            transcript: '', // Would be actual transcription
          }));
        }, 500);
      }

      return uri;
    } catch (error) {
      console.error('Stop listening error:', error);
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        error: 'Failed to process audio' 
      }));
    }
  }, [recording]);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '' }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  return {
    ...state,
    startListening,
    stopListening,
    clearTranscript,
  };
}

export default useVoiceInput;
