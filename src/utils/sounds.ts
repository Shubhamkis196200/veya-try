import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// Sound URLs (free cosmic sounds)
const SOUNDS = {
  tap: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  magic: 'https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/3100/3100-preview.mp3',
  chime: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
};

type SoundType = keyof typeof SOUNDS;

class SoundManager {
  private sounds: Map<string, Audio.Sound> = new Map();
  private enabled: boolean = true;
  private hapticEnabled: boolean = true;

  async preload() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      });
    } catch (e) {
      // Audio setup error - sounds will be disabled
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setHapticEnabled(enabled: boolean) {
    this.hapticEnabled = enabled;
  }

  async play(type: SoundType, volume: number = 0.5) {
    if (!this.enabled) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUNDS[type] },
        { shouldPlay: true, volume }
      );
      
      // Clean up after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {
      // Sound play error - silent failure is acceptable
    }
  }

  // Haptic feedback methods
  async tapHaptic() {
    if (!this.hapticEnabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async successHaptic() {
    if (!this.hapticEnabled) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async warningHaptic() {
    if (!this.hapticEnabled) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  async heavyHaptic() {
    if (!this.hapticEnabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  async selectionHaptic() {
    if (!this.hapticEnabled) return;
    await Haptics.selectionAsync();
  }

  // Combined effects
  async playWithHaptic(type: SoundType, hapticType: 'tap' | 'success' | 'heavy' = 'tap') {
    if (hapticType === 'tap') this.tapHaptic();
    else if (hapticType === 'success') this.successHaptic();
    else this.heavyHaptic();
    
    this.play(type);
  }
}

export const soundManager = new SoundManager();
export default soundManager;
