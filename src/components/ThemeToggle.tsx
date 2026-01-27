import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { mode, setMode, colors, isDark } = useTheme();

  const options = [
    { key: 'light', icon: 'sunny', label: 'Light' },
    { key: 'dark', icon: 'moon', label: 'Dark' },
    { key: 'system', icon: 'phone-portrait', label: 'Auto' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.text }]}>Appearance</Text>
      <View style={[styles.toggleGroup, { backgroundColor: colors.surfaceLight }]}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.option,
              mode === opt.key && { backgroundColor: colors.primary },
            ]}
            onPress={() => setMode(opt.key)}
          >
            <Ionicons
              name={opt.icon as any}
              size={18}
              color={mode === opt.key ? '#FFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.optionText,
                { color: mode === opt.key ? '#FFF' : colors.textSecondary },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
