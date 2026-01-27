/**
 * INTERACTIVE BIRTH CHART WHEEL
 * Simple version without SVG for compatibility
 */
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 48;

const SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'fire' },
  { name: 'Taurus', symbol: '♉', element: 'earth' },
  { name: 'Gemini', symbol: '♊', element: 'air' },
  { name: 'Cancer', symbol: '♋', element: 'water' },
  { name: 'Leo', symbol: '♌', element: 'fire' },
  { name: 'Virgo', symbol: '♍', element: 'earth' },
  { name: 'Libra', symbol: '♎', element: 'air' },
  { name: 'Scorpio', symbol: '♏', element: 'water' },
  { name: 'Sagittarius', symbol: '♐', element: 'fire' },
  { name: 'Capricorn', symbol: '♑', element: 'earth' },
  { name: 'Aquarius', symbol: '♒', element: 'air' },
  { name: 'Pisces', symbol: '♓', element: 'water' },
];

const PLANETS = [
  { symbol: '☉', name: 'Sun', sign: 'Leo' },
  { symbol: '☽', name: 'Moon', sign: 'Cancer' },
  { symbol: '☿', name: 'Mercury', sign: 'Virgo' },
  { symbol: '♀', name: 'Venus', sign: 'Libra' },
  { symbol: '♂', name: 'Mars', sign: 'Aries' },
  { symbol: '♃', name: 'Jupiter', sign: 'Sagittarius' },
  { symbol: '♄', name: 'Saturn', sign: 'Capricorn' },
];

export function BirthChart() {
  const { colors, elements } = useTheme();
  
  const getElementColor = (element: string) => {
    switch (element) {
      case 'fire': return '#FF6B35';
      case 'earth': return '#6B8E23';
      case 'air': return '#87CEEB';
      case 'water': return '#4169E1';
      default: return colors.text.secondary;
    }
  };
  
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      {/* Zodiac wheel */}
      <View style={[styles.wheel, { backgroundColor: colors.bg.elevated, borderColor: colors.border.accent }]}>
        <View style={styles.innerCircle}>
          <Text style={[styles.centerText, { color: colors.text.muted }]}>Birth Chart</Text>
        </View>
        
        {/* Zodiac signs around the wheel */}
        <View style={styles.signsContainer}>
          {SIGNS.map((sign, index) => {
            const angle = (index * 30 - 90) * (Math.PI / 180);
            const radius = CHART_SIZE / 2 - 40;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <View
                key={sign.name}
                style={[
                  styles.signItem,
                  {
                    transform: [
                      { translateX: x },
                      { translateY: y },
                    ],
                  },
                ]}
              >
                <Text style={[styles.signSymbol, { color: getElementColor(sign.element) }]}>
                  {sign.symbol}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      
      {/* Planet positions */}
      <View style={styles.planetsContainer}>
        <Text style={[styles.planetsTitle, { color: colors.text.secondary }]}>Planet Positions</Text>
        <View style={styles.planetsList}>
          {PLANETS.map((planet) => (
            <View key={planet.name} style={styles.planetRow}>
              <Text style={[styles.planetSymbol, { color: colors.accent }]}>{planet.symbol}</Text>
              <Text style={[styles.planetName, { color: colors.text.primary }]}>{planet.name}</Text>
              <Text style={[styles.planetSign, { color: colors.text.muted }]}>in {planet.sign}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wheel: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    borderRadius: CHART_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: CHART_SIZE * 0.4,
    height: CHART_SIZE * 0.4,
    borderRadius: CHART_SIZE * 0.2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 14,
  },
  signsContainer: {
    position: 'absolute',
    width: CHART_SIZE,
    height: CHART_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signItem: {
    position: 'absolute',
  },
  signSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planetsContainer: {
    marginTop: 20,
    width: '100%',
  },
  planetsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  planetsList: {
    gap: 8,
  },
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  planetSymbol: {
    fontSize: 20,
    width: 30,
  },
  planetName: {
    fontSize: 15,
    width: 80,
  },
  planetSign: {
    fontSize: 14,
  },
});

export default BirthChart;
