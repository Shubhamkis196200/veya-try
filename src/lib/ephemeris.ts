/**
 * EPHEMERIS CALCULATIONS
 * Calculate real planet positions using astronomy formulas
 * Simplified version - for production use Swiss Ephemeris
 */

// Julian Date calculation
function toJulianDate(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + 
    date.getUTCHours() / 24 + 
    date.getUTCMinutes() / 1440 + 
    date.getUTCSeconds() / 86400;
  
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + 
    Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

// Normalize angle to 0-360
function normalize(deg: number): number {
  while (deg < 0) deg += 360;
  while (deg >= 360) deg -= 360;
  return deg;
}

// Planet orbital elements (simplified)
const PLANETS = {
  sun: { period: 365.256363, epoch: 280.46646, rate: 0.9856474 },
  moon: { period: 27.321582, epoch: 218.3164, rate: 13.176396 },
  mercury: { period: 87.969, epoch: 252.2509, rate: 4.0923344 },
  venus: { period: 224.701, epoch: 181.9798, rate: 1.6021687 },
  mars: { period: 686.971, epoch: 355.4533, rate: 0.5240208 },
  jupiter: { period: 4332.59, epoch: 34.3515, rate: 0.0830853 },
  saturn: { period: 10759.22, epoch: 50.0774, rate: 0.0334442 },
  uranus: { period: 30685.4, epoch: 314.055, rate: 0.0117254 },
  neptune: { period: 60189.0, epoch: 304.349, rate: 0.0059806 },
  pluto: { period: 90465.0, epoch: 238.929, rate: 0.003972 },
};

// Zodiac signs
const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Get zodiac sign from degree
function getSign(degree: number): string {
  const normalizedDeg = normalize(degree);
  const signIndex = Math.floor(normalizedDeg / 30);
  return SIGNS[signIndex];
}

// Get degree within sign (0-29)
function getDegreeInSign(degree: number): number {
  return normalize(degree) % 30;
}

export interface PlanetPosition {
  planet: string;
  longitude: number; // 0-360
  sign: string;
  degree: number; // 0-29 within sign
  minute: number;
  retrograde: boolean;
}

export interface ChartData {
  date: Date;
  planets: PlanetPosition[];
  ascendant?: number;
  houses?: number[];
}

// Calculate planet longitude for a given date
function calculatePlanetLongitude(planet: keyof typeof PLANETS, jd: number): number {
  const data = PLANETS[planet];
  const j2000 = 2451545.0; // Jan 1, 2000 12:00 TT
  const daysSinceJ2000 = jd - j2000;
  
  // Mean longitude
  const longitude = data.epoch + data.rate * daysSinceJ2000;
  
  return normalize(longitude);
}

// Calculate all planet positions
export function calculatePlanetPositions(date: Date): PlanetPosition[] {
  const jd = toJulianDate(date);
  const positions: PlanetPosition[] = [];
  
  for (const [name, _] of Object.entries(PLANETS)) {
    const longitude = calculatePlanetLongitude(name as keyof typeof PLANETS, jd);
    const sign = getSign(longitude);
    const degInSign = getDegreeInSign(longitude);
    const degree = Math.floor(degInSign);
    const minute = Math.round((degInSign - degree) * 60);
    
    positions.push({
      planet: name.charAt(0).toUpperCase() + name.slice(1),
      longitude,
      sign,
      degree,
      minute,
      retrograde: false, // Would need more complex calculation
    });
  }
  
  return positions;
}

// Calculate ascendant (simplified - needs birth time & location for accuracy)
export function calculateAscendant(date: Date, latitude: number, longitude: number): number {
  const jd = toJulianDate(date);
  const lst = calculateLocalSiderealTime(jd, longitude);
  
  // Simplified ascendant calculation
  const obliquity = 23.4393; // Earth's axial tilt in degrees
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;
  
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  const ascRad = Math.atan2(y, x);
  
  return normalize(ascRad * 180 / Math.PI);
}

// Calculate local sidereal time
function calculateLocalSiderealTime(jd: number, longitude: number): number {
  const j2000 = 2451545.0;
  const d = jd - j2000;
  const gst = normalize(280.46061837 + 360.98564736629 * d);
  const lst = gst + longitude;
  return normalize(lst);
}

// Calculate Placidus houses (simplified)
export function calculateHouses(ascendant: number): number[] {
  const houses: number[] = [];
  for (let i = 0; i < 12; i++) {
    houses.push(normalize(ascendant + i * 30));
  }
  return houses;
}

// Generate full birth chart
export function generateBirthChart(
  birthDate: Date,
  birthLat?: number,
  birthLong?: number
): ChartData {
  const planets = calculatePlanetPositions(birthDate);
  
  let ascendant: number | undefined;
  let houses: number[] | undefined;
  
  if (birthLat !== undefined && birthLong !== undefined) {
    ascendant = calculateAscendant(birthDate, birthLat, birthLong);
    houses = calculateHouses(ascendant);
  }
  
  return {
    date: birthDate,
    planets,
    ascendant,
    houses,
  };
}

// Get current transits
export function getCurrentTransits(): PlanetPosition[] {
  return calculatePlanetPositions(new Date());
}

// Check for significant transits
export function checkSignificantTransits(natalChart: ChartData): string[] {
  const currentPositions = getCurrentTransits();
  const alerts: string[] = [];
  
  for (const transit of currentPositions) {
    for (const natal of natalChart.planets) {
      const orb = Math.abs(transit.longitude - natal.longitude);
      
      // Conjunction (0°)
      if (orb < 5 || orb > 355) {
        alerts.push(`${transit.planet} conjunct natal ${natal.planet} in ${natal.sign}`);
      }
      // Opposition (180°)
      else if (Math.abs(orb - 180) < 5) {
        alerts.push(`${transit.planet} opposite natal ${natal.planet}`);
      }
      // Square (90°)
      else if (Math.abs(orb - 90) < 5 || Math.abs(orb - 270) < 5) {
        alerts.push(`${transit.planet} square natal ${natal.planet}`);
      }
    }
  }
  
  return alerts.slice(0, 5); // Return top 5 alerts
}

// Moon phase calculation
export function getMoonPhase(date: Date): { phase: string; illumination: number; emoji: string } {
  const jd = toJulianDate(date);
  const sunLong = calculatePlanetLongitude('sun', jd);
  const moonLong = calculatePlanetLongitude('moon', jd);
  
  const angle = normalize(moonLong - sunLong);
  const illumination = (1 - Math.cos(angle * Math.PI / 180)) / 2 * 100;
  
  let phase: string;
  let emoji: string;
  
  if (angle < 22.5 || angle >= 337.5) {
    phase = 'New Moon';
    emoji = '🌑';
  } else if (angle < 67.5) {
    phase = 'Waxing Crescent';
    emoji = '🌒';
  } else if (angle < 112.5) {
    phase = 'First Quarter';
    emoji = '🌓';
  } else if (angle < 157.5) {
    phase = 'Waxing Gibbous';
    emoji = '🌔';
  } else if (angle < 202.5) {
    phase = 'Full Moon';
    emoji = '🌕';
  } else if (angle < 247.5) {
    phase = 'Waning Gibbous';
    emoji = '🌖';
  } else if (angle < 292.5) {
    phase = 'Last Quarter';
    emoji = '🌗';
  } else {
    phase = 'Waning Crescent';
    emoji = '🌘';
  }
  
  return { phase, illumination: Math.round(illumination), emoji };
}

export default {
  calculatePlanetPositions,
  generateBirthChart,
  getCurrentTransits,
  checkSignificantTransits,
  getMoonPhase,
};
