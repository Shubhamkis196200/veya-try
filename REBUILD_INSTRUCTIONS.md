# Veya App Rebuild Instructions

## Tech Stack
- Expo SDK 54 + Expo Router
- TypeScript (strict)
- Supabase (auth + database)
- AWS Bedrock Claude (AI generation)
- Zustand (state)
- React Native Reanimated (animations)

## Supabase Config
```
URL: https://ennlryjggdoljgbqhttb.supabase.co
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubmxyeWpnZ2RvbGpnYnFodHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Nzg3ODMsImV4cCI6MjA4NTA1NDc4M30.FOlCuYFogxXTdvgUTMw7Em4-dn2ANRRAHdf6WeJi3yY
```

## Database Schema (Supabase)

### profiles
- id: uuid (FK to auth.users)
- name: text
- dob: date
- birth_time: time (nullable)
- birth_place: text (nullable)
- fortune_method: text (vedic/western/chinese)
- intent: text (love/career/family/growth/wealth/general)
- zodiac_sign: text
- created_at: timestamp
- updated_at: timestamp

### daily_insights
- id: uuid
- user_id: uuid (FK to profiles)
- date: date
- theme: text
- energy_summary: text
- do_list: jsonb (array)
- avoid_list: jsonb (array)
- lucky_color: text
- lucky_number: int
- lucky_time: text
- gem_name: text
- gem_reason: text
- focus_area: text
- energy_level: int
- created_at: timestamp

### chat_messages
- id: uuid
- user_id: uuid (FK to profiles)
- role: text (user/assistant)
- content: text
- created_at: timestamp

### subscriptions
- id: uuid
- user_id: uuid (FK to profiles)
- plan: text (free/premium/pro)
- status: text (active/cancelled/expired)
- expires_at: timestamp
- created_at: timestamp

## File Structure
```
/app
  _layout.tsx          # Root layout with auth check
  index.tsx            # Splash/redirect
  (auth)/
    _layout.tsx
    welcome.tsx
    intent-select.tsx
    method-select.tsx
    data-input.tsx
    generating.tsx
  (tabs)/
    _layout.tsx        # Tab navigator + FloatingOrb
    index.tsx          # Today screen
    forecast.tsx       # Weekly/Monthly
    chat.tsx           # AI Chat
    shop.tsx           # Gems
    profile.tsx        # User profile
/src
  /components
    /ui               # Primitives
      Button.tsx
      Card.tsx
      Input.tsx
    FloatingOrb.tsx
    InsightCard.tsx
    EnergyMeter.tsx
    CalendarDay.tsx
    QuickStatBadge.tsx
  /constants
    theme.ts
    zodiac.ts
  /lib
    supabase.ts
    ai.ts
  /stores
    useStore.ts
    useAuth.ts
  /types
    index.ts
  /utils
    zodiac.ts
    dates.ts
```

## Design System

### Colors
```typescript
export const COLORS = {
  background: '#FAFAFA',
  backgroundCard: '#FFFFFF',
  primary: '#B8860B',
  primaryLight: '#D4AF37',
  primaryMuted: '#E8DCC8',
  textPrimary: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textMuted: '#8A8A8A',
  border: '#E5E5E5',
  intent: {
    love: '#D81B60',
    career: '#1565C0',
    family: '#2E7D32',
    growth: '#7B1FA2',
    wealth: '#F57F17',
  },
  method: {
    vedic: '#7E57C2',
    western: '#FF8F00',
    chinese: '#C62828',
  }
};
```

### Typography
- Display: 40px, weight 300, serif
- H1: 32px, weight 300, serif
- H2: 24px, weight 400, serif
- Body: 16px, weight 400, line-height 26
- Overline: 11px, weight 600, uppercase, letter-spacing 2

## Security Rules

### NEVER:
- Store tokens in AsyncStorage (use SecureStore)
- Hardcode API keys
- Log sensitive data

### ALWAYS:
- Use Supabase RLS for data access
- Validate inputs
- Handle errors gracefully

## AI Prompt Template

For daily insights:
```
You are Veya, a sophisticated AI astrologer. Generate a personalized daily insight for:
- Name: {name}
- Date of Birth: {dob}
- Zodiac: {zodiac}
- Method: {method} astrology
- Focus: {intent}

Provide:
1. Theme (2-4 words)
2. Energy summary (2-3 sentences)
3. 3 things to do today
4. 2 things to avoid
5. Lucky color, number (1-9), best time
6. Gem recommendation with reason
7. Focus area advice (specific to user's intent)
8. Energy level (1-100)

Be sophisticated, NO emojis, specific and actionable.
```

## Build Order
1. Set up Expo Router structure
2. Create Supabase client + tables
3. Build theme system
4. Create UI primitives
5. Build auth flow (onboarding)
6. Build main tabs
7. Add AI integration
8. Polish animations
