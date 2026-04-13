# Project Template: Mobile App

Typical phase structure for a React Native / Expo app, iOS + Android.

**Default depth:** `standard` (5-8 phases)
**Typical stack:** Expo SDK + React Native + TypeScript + Supabase + Expo Application Services (EAS)

## Typical Phases

### Phase 1: Foundation

**Goal:** Expo project scaffolded, Supabase wired, auth flow working on both iOS and Android simulators.

**Typical success criteria:**
1. App runs in Expo Go on iOS simulator
2. App runs in Expo Go on Android emulator
3. User can sign up + log in
4. Session persists across app restart

### Phase 2: Navigation & Core Screens

**Goal:** Main screens exist with navigation (Expo Router), each renders its placeholder state.

**Requirements covered:** Home, Profile, Settings, main feature screen.

### Phase 3: Core Feature

**Goal:** The primary user capability works end-to-end on mobile.

**Requirements covered:** Feature-specific (depends on app — camera, map, list, etc.)

### Phase 4: Native Integrations

**Goal:** Native features wired — push notifications, camera, location, secure storage.

**Requirements covered:** Push notifications (FCM/APNs), camera/gallery access, location, SecureStore for tokens.

### Phase 5: Build & Submit

**Goal:** Production builds for iOS and Android, submitted to stores.

**Requirements covered:** EAS build profiles, app icons, splash screens, App Store Connect setup, Google Play Console setup.

## Common Requirements Categories

- **AUTH** — authentication
- **NAV** — navigation and screens
- **CORE** — core feature
- **NAT** — native integrations (notifications, camera, location)
- **BUILD** — EAS build and store submission

## Research Flags

- **App Store compliance** (in-app purchases, privacy, age ratings) → `/qualia-discuss` to lock scope
- **Native module choices** (notifications, maps, camera) → `/qualia-research` per phase
- **Deep linking and universal links** → `/qualia-discuss` before navigation phase
