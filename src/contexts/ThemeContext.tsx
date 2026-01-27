import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  colors: typeof darkColors;
}

const darkColors = {
  background: '#0A0A1A',
  surface: '#1A1A2E',
  surfaceLight: '#252542',
  primary: '#8B7FD9',
  primaryLight: '#A78BFA',
  secondary: '#C9A962',
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  border: '#333355',
  success: '#10B981',
  error: '#EF4444',
  card: 'rgba(26, 26, 46, 0.8)',
};

const lightColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  primary: '#7C3AED',
  primaryLight: '#8B7FD9',
  secondary: '#D97706',
  text: '#1A1A2E',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  error: '#EF4444',
  card: 'rgba(255, 255, 255, 0.9)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((saved) => {
      if (saved) setModeState(saved as ThemeMode);
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem('themeMode', newMode);
  };

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
