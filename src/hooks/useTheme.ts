/**
 * VEYA THEME HOOK
 * Access theme colors, spacing, and typography
 */
import { useCallback, useMemo } from 'react';
import { useColorScheme, TextStyle, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { dark, light, celestial, elements } from '../constants/colors';
import { SPACING, RADIUS, ANIMATION, SHADOWS, ICON_SIZE, HIT_SLOP } from '../constants/tokens';
import { typography, createTextStyle } from '../constants/typography';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  loadSavedMode: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'dark',
  setMode: async (mode) => {
    set({ mode });
    await AsyncStorage.setItem('theme_mode', mode);
  },
  loadSavedMode: async () => {
    const saved = await AsyncStorage.getItem('theme_mode');
    if (saved) set({ mode: saved as ThemeMode });
  },
}));

export function useTheme() {
  const systemScheme = useColorScheme();
  const { mode, setMode } = useThemeStore();
  
  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? dark : light;
  
  const theme = useMemo(() => ({
    mode,
    isDark,
    colors,
    celestial,
    elements,
    spacing: SPACING,
    radius: RADIUS,
    animation: ANIMATION,
    shadows: SHADOWS,
    iconSize: ICON_SIZE,
    hitSlop: HIT_SLOP,
    typography,
  }), [isDark, colors, mode]);
  
  const text = useCallback((
    variant: keyof typeof typography,
    colorKey: keyof typeof colors.text = 'primary'
  ): TextStyle => createTextStyle(variant, colors.text[colorKey]), [colors]);
  
  const card = useCallback((elevated = false): ViewStyle => ({
    backgroundColor: elevated ? colors.bg.elevated : colors.bg.tertiary,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...(elevated ? SHADOWS.md : SHADOWS.sm),
  }), [colors]);
  
  return { ...theme, setMode, text, card };
}
