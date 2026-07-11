# ClearDrive 💧

Water-quality information for New Jersey — official monitoring readings and
community-submitted samples for local rivers, lakes, reservoirs, bays, and
beaches, in one app.

> **For general information only.** ClearDrive is not a substitute for official
> government advisories, beach closures, or drinking-water notices, and must not
> be used to decide whether water is safe to drink, swim in, or use. Always
> follow official guidance.

Built with [Expo](https://expo.dev) (SDK 57) + [expo-router](https://docs.expo.dev/router/introduction/)
and React Native, targeting iOS and Android from one TypeScript codebase.

## Features

- **Nearby** — browse NJ water bodies, optionally sorted by distance using
  on-device location (entirely optional; the app works without it).
- **Explore** — search by name/town/county and filter by water-body type.
- **Water-body detail** — latest official readings with per-parameter status
  against simplified reference ranges, pull-to-refresh, and clear source
  attribution (live USGS, cached, or bundled sample data).
- **Report** — submit a crowdsourced water sample. Samples are validated,
  stored on-device, and always labeled unverified.
- **About / Legal** — safety disclaimer, privacy policy, terms of use, and data
  source attribution, plus environmental-hazard reporting contacts.
- A one-time **safety disclaimer gate** that must be accepted before use, with a
  versioned consent record so material changes re-prompt users.

## Getting started

```bash
npm install
npx expo start        # then press i / a / w, or scan the QR code
```

Useful scripts:

```bash
npm run typecheck     # tsc --noEmit
npx expo export --platform web   # verify the bundle builds
```

## Project structure

```
app/                       expo-router routes
  _layout.tsx              root layout + disclaimer gate
  onboarding.tsx           safety disclaimer acceptance screen
  (tabs)/                  Nearby, Explore, Report, About
  water-body/[id].tsx      water-body detail
  legal/[doc].tsx          disclaimer / privacy / terms / sources
components/                shared UI (cards, badges, states, rows)
  ui/                      primitives (Button, Card, Chip, StatusBadge, …)
hooks/                     useTheme, useNow, useDisclaimer, useWaterBodyList
constants/                 Colors, Layout tokens
src/
  data/                    models, parameter thresholds, NJ seed dataset
  services/                storage, samples, officialApi (USGS), location, disclaimer
  utils/                   waterQuality classification, geo, formatting
  content/legal.ts         all legal / disclaimer / attribution copy
```

## Data sources & accuracy

- **Official data** comes from the [USGS National Water Information
  System](https://waterdata.usgs.gov/nwis) (a free, public, no-key API) when the
  device is online. Results are cached briefly and fall back to a bundled
  snapshot when offline.
- **Bundled measurement values are illustrative sample data** used for offline
  display and demonstration; they are labeled "Sample data" in the UI. USGS
  station IDs in the dataset are real so live fetches resolve.
- **Community samples are crowdsourced and unverified.** They are never
  presented as official.
- Status labels ("Good / Moderate / Poor / Unhealthy") compare readings against
  **simplified, general reference ranges** derived from public EPA/NJDEP
  guidance — they are **not** the legal standards regulators use. See
  `src/data/parameters.ts` for each threshold's source.

## App-store readiness

- `app.json` sets bundle identifiers (`app.cleardrive.mobile`), version/build
  numbers, portrait orientation, and adaptive/splash assets.
- Location is optional and gated behind clear, purpose-specific usage strings
  (iOS `NSLocationWhenInUseUsageDescription`, Android runtime permissions);
  background location is explicitly disabled/blocked.
- An iOS **privacy manifest** declares the required-reason UserDefaults API use
  (for local storage) and declares no tracking and no collected data types.
- In-app **privacy policy**, **terms of use**, **safety disclaimer**, and
  **data-source attribution** are all reachable from the About tab.
- `eas.json` provides development/preview/production build profiles for
  [EAS Build](https://docs.expo.dev/build/introduction/).

### Before submitting to the stores

These are the human steps that remain outside the code:

1. Replace the placeholder app icon/splash art in `assets/images/` with final
   branded artwork.
2. Fill in a real support email and, if you have one, a hosted web URL for the
   privacy policy/terms (some stores require a public link in addition to
   in-app text). Update `src/content/legal.ts`.
3. Have the legal/disclaimer copy reviewed by counsel for your jurisdiction.
4. Create the app records in App Store Connect and Google Play Console, then run
   `eas build --profile production` and `eas submit`.
5. Complete each store's data-safety / privacy questionnaire — ClearDrive
   collects no personal data and does not track users, which keeps this simple.

## Disclaimer

ClearDrive is an independent, informational app. It is not affiliated with or
endorsed by the USGS, the US EPA, the NJDEP, or any government agency. Water
conditions change rapidly and no app can guarantee safety. To report an
environmental hazard in New Jersey, call the NJDEP hotline at
**1-877-WARNDEP (1-877-927-6337)**; in an emergency, call **911**.
