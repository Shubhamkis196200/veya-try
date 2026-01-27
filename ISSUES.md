# VEYA APP - FULL ISSUE LIST
**Date:** January 27, 2026

---

## 🔴 CRITICAL ISSUES (Blocking)

### 1. AI Chat Not Connected to Bedrock
- **Location:** `src/services/ai.ts`
- **Problem:** Edge function not deployed, using local fallback
- **Impact:** AI responses are local, not using Claude
- **Fix:** Deploy `supabase/functions/chat` with AWS credentials

### 2. Keyboard Hides Input (Android)
- **Location:** `app/(tabs)/chat.tsx`
- **Problem:** Message input hidden when keyboard opens
- **Impact:** Users can't see what they're typing
- **Fix:** Adjust KeyboardAvoidingView offset or use react-native-keyboard-aware-scroll-view

### 3. Bottom Nav Overlaps Content
- **Location:** `app/(tabs)/_layout.tsx` + all tab screens
- **Problem:** Tab bar covers bottom content
- **Impact:** Users can't access buttons/content at bottom
- **Fix:** Add consistent paddingBottom (140px) to all ScrollViews

---

## 🟠 HIGH PRIORITY ISSUES

### 4. Data is Generic/Rigid
- **Location:** `src/services/ai.ts`, `src/services/horoscope.ts`
- **Problem:** Using simplified local calculations, not real ephemeris
- **Impact:** Readings feel repetitive and not personalized
- **Fix:** Integrate Swiss Ephemeris API for accurate planet positions

### 5. Birth Data Input Incomplete
- **Location:** `app/(auth)/data-input.tsx`
- **Problem:** Basic text inputs, no proper date/time pickers
- **Impact:** Poor UX, potential invalid data entry
- **Fix:** Add DateTimePicker, location autocomplete

### 6. Profile Not Showing User Data
- **Location:** `app/(tabs)/profile.tsx`
- **Problem:** Hardcoded or missing Big 3 display
- **Impact:** Users don't see their personalized info
- **Fix:** Pull from Supabase profile, calculate from birth data

### 7. Chat History Not Persisted
- **Location:** `app/(tabs)/chat.tsx`
- **Problem:** Messages lost on app restart
- **Impact:** No conversation continuity
- **Fix:** Save to Supabase `chat_messages` table

---

## 🟡 MEDIUM PRIORITY ISSUES

### 8. Forecast Screen Basic
- **Location:** `app/(tabs)/forecast.tsx`
- **Problem:** Placeholder content, not real weekly forecast
- **Impact:** Feature feels incomplete
- **Fix:** Generate 7-day forecast from ephemeris

### 9. Shop Not Functional
- **Location:** `app/(tabs)/shop.tsx`
- **Problem:** UI only, no purchase flow
- **Impact:** Monetization not working
- **Fix:** Integrate in-app purchases (RevenueCat)

### 10. Tarot Feature Incomplete
- **Location:** `app/features/tarot.tsx`
- **Problem:** Basic UI, no card drawing logic
- **Impact:** Feature doesn't work
- **Fix:** Add card deck, spreads, interpretations

### 11. Moon Phase Screen Basic
- **Location:** `app/features/moon.tsx`
- **Problem:** Simple display, missing rituals/guidance
- **Impact:** Thin feature
- **Fix:** Add moon rituals, optimal activities

### 12. No Push Notifications
- **Location:** `src/services/notifications.ts`
- **Problem:** Service exists but not scheduled
- **Impact:** No daily engagement
- **Fix:** Schedule daily reading notifications

---

## 🟢 LOW PRIORITY ISSUES

### 13. No Error Boundaries
- **Problem:** App crashes show blank screen
- **Fix:** Add React error boundaries

### 14. No Loading States Everywhere
- **Problem:** Some screens flash content
- **Fix:** Add skeleton loaders consistently

### 15. No Offline Support
- **Problem:** App fails without internet
- **Fix:** Cache readings, show offline state

### 16. No Analytics
- **Problem:** Can't track user behavior
- **Fix:** Add Mixpanel or Amplitude

### 17. TypeScript Errors
- **Problem:** Some type mismatches remain
- **Fix:** Run `npx tsc --noEmit` and fix all

### 18. No Tests
- **Problem:** 0% test coverage
- **Fix:** Add Jest unit tests

---

## 🐛 SPECIFIC BUGS

| # | Bug | File | Line | Status |
|---|-----|------|------|--------|
| 1 | `intents` property doesn't exist on Profile type | intent-select.tsx | 116 | Fixed |
| 2 | `sceneContainerStyle` not valid option | _layout.tsx | 42 | Fixed |
| 3 | `getPlanetaryHour` not exported | horoscope.ts | 5 | Removed |
| 4 | `calculatePlanetPositions` signature mismatch | ai.ts | 33-34 | Fixed |
| 5 | Moon phase calculation off by timezone | ai.ts | getMoonPhase | Check |

---

## 📱 DEVICE-SPECIFIC ISSUES

### Android
- Keyboard overlap in chat ❌
- Status bar color not matching theme ⚠️
- Haptics may not work on all devices ⚠️

### iOS
- Safe area insets need testing ⚠️
- Blur effect performance ⚠️
- Push notification permissions ⚠️

---

## 🔗 INTEGRATION ISSUES

### Supabase
- [ ] Edge function `chat` not deployed
- [ ] Database tables not created
- [ ] Auth flow not tested end-to-end
- [ ] RLS policies not configured

### AWS Bedrock
- [x] Secrets added (ACCESS_KEY, SECRET, REGION)
- [ ] Edge function not deployed
- [ ] Model access not verified
- [ ] Error handling incomplete

### Expo
- [x] EAS Update working
- [ ] Production build not created
- [ ] App icons/splash not finalized
- [ ] Store listing not prepared

---

## 📋 ISSUE SUMMARY

| Priority | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 3 | Needs immediate fix |
| 🟠 High | 4 | Should fix this sprint |
| 🟡 Medium | 5 | Next sprint |
| 🟢 Low | 6 | Backlog |
| **Total** | **18** | |

---

## 🎯 RECOMMENDED FIX ORDER

1. **Keyboard overlap** - Test v1.6, adjust if needed
2. **Bottom nav overlap** - Verify padding fixes
3. **Deploy Bedrock** - Real AI responses
4. **Swiss Ephemeris** - Accurate data
5. **Birth data input** - Better UX
6. **Profile screen** - Show user's Big 3
7. **Chat persistence** - Save history
8. **Forecast completion** - Real predictions

---

*Last Updated: 2026-01-27 22:47 UTC*
