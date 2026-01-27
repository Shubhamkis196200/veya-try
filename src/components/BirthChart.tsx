/**
 * INTERACTIVE BIRTH CHART WHEEL
 * SVG-based astrological chart visualization
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G, Path } from 'react-native-svg';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring, withDelay } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 48;
const CENTER = CHART_SIZE / 2;
const OUTER_RADIUS = CENTER - 20;
const INNER_RADIUS = OUTER_RADIUS * 0.65;
const PLANET_RADIUS = OUTER_RADIUS * 0.82;

// Zodiac signs with symbols
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

// Planet symbols
const PLANETS = {
  sun: { symbol: '☉', name: 'Sun' },
  moon: { symbol: '☽', name: 'Moon' },
  mercury: { symbol: '☿', name: 'Mercury' },
  venus: { symbol: '♀', name: 'Venus' },
  mars: { symbol: '♂', name: 'Mars' },
  jupiter: { symbol: '♃', name: 'Jupiter' },
  saturn: { symbol: '♄', name: 'Saturn' },
  uranus: { symbol: '♅', name: 'Uranus' },
  neptune: { symbol: '♆', name: 'Neptune' },
  pluto: { symbol: '♇', name: 'Pluto' },
};

interface PlanetPosition {
  planet: keyof typeof PLANETS;
  sign: string;
  degree: number;
  house: number;
}

interface BirthChartProps {
  planets?: PlanetPosition[];
  ascendant?: number; // Degree of ascendant
  houses?: number[]; // Array of house cusps in degrees
}

export function BirthChart({ planets = [], ascendant = 0, houses = [] }: BirthChartProps) {
  const { colors, celestial, elements } = useTheme();
  
  // Convert degree to x,y coordinates
  const degToCoord = (deg: number, radius: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER + radius * Math.sin(rad),
    };
  };
  
  // Get element color
  const getElementColor = (element: string) => {
    switch (element) {
      case 'fire': return elements.fire;
      case 'earth': return elements.earth;
      case 'air': return elements.air;
      case 'water': return elements.water;
      default: return colors.text.secondary;
    }
  };
  
  // Generate default planet positions for demo
  const defaultPlanets: PlanetPosition[] = [
    { planet: 'sun', sign: 'Leo', degree: 135, house: 5 },
    { planet: 'moon', sign: 'Cancer', degree: 105, house: 4 },
    { planet: 'mercury', sign: 'Virgo', degree: 162, house: 6 },
    { planet: 'venus', sign: 'Libra', degree: 195, house: 7 },
    { planet: 'mars', sign: 'Aries', degree: 15, house: 1 },
    { planet: 'jupiter', sign: 'Sagittarius', degree: 255, house: 9 },
    { planet: 'saturn', sign: 'Capricorn', degree: 285, house: 10 },
  ];
  
  const chartPlanets = planets.length > 0 ? planets : defaultPlanets;
  
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
        {/* Outer circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS}
          stroke={colors.border.accent}
          strokeWidth={2}
          fill="none"
        />
        
        {/* Inner circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_RADIUS}
          stroke={colors.border.default}
          strokeWidth={1}
          fill={colors.bg.secondary}
        />
        
        {/* Zodiac divisions (30° each) */}
        {SIGNS.map((sign, i) => {
          const startAngle = i * 30 + ascendant;
          const midAngle = startAngle + 15;
          const start = degToCoord(startAngle, INNER_RADIUS);
          const end = degToCoord(startAngle, OUTER_RADIUS);
          const labelPos = degToCoord(midAngle, (INNER_RADIUS + OUTER_RADIUS) / 2);
          
          return (
            <G key={sign.name}>
              {/* Division line */}
              <Line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={colors.border.default}
                strokeWidth={1}
              />
              {/* Sign symbol */}
              <SvgText
                x={labelPos.x}
                y={labelPos.y}
                fill={getElementColor(sign.element)}
                fontSize={16}
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {sign.symbol}
              </SvgText>
            </G>
          );
        })}
        
        {/* House lines (if provided) */}
        {houses.map((cusp, i) => {
          const start = degToCoord(cusp + ascendant, 0);
          const end = degToCoord(cusp + ascendant, INNER_RADIUS);
          return (
            <Line
              key={`house-${i}`}
              x1={CENTER}
              y1={CENTER}
              x2={end.x}
              y2={end.y}
              stroke={colors.border.gold}
              strokeWidth={i % 3 === 0 ? 2 : 1}
              strokeDasharray={i % 3 === 0 ? "0" : "4,4"}
            />
          );
        })}
        
        {/* Planets */}
        {chartPlanets.map((pos, i) => {
          const coord = degToCoord(pos.degree + ascendant, PLANET_RADIUS);
          const planetInfo = PLANETS[pos.planet];
          const planetColor = celestial[pos.planet] || colors.primary;
          
          return (
            <G key={pos.planet}>
              {/* Planet glow */}
              <Circle
                cx={coord.x}
                cy={coord.y}
                r={14}
                fill={planetColor}
                opacity={0.2}
              />
              {/* Planet symbol */}
              <SvgText
                x={coord.x}
                y={coord.y}
                fill={planetColor}
                fontSize={18}
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {planetInfo.symbol}
              </SvgText>
            </G>
          );
        })}
        
        {/* Center point */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={4}
          fill={colors.accent}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BirthChart;
