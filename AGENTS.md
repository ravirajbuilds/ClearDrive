# ClearDrive — agent notes

ClearDrive is an Expo (SDK 57) + expo-router + TypeScript app showing New Jersey
water-quality data from official sources (USGS) and crowdsourced community
samples. See `README.md` for the full overview.

## Before writing code

- Expo changes fast. Read the versioned docs at
  https://docs.expo.dev/versions/v57.0.0/ before using an Expo API.
- Run `npm run typecheck` and `npx expo export --platform web` to verify changes
  bundle. Both must pass.

## Conventions

- Theme through `useTheme()` (in `hooks/`) and the tokens in `constants/`. Never
  hard-code hex colors in screens/components.
- Domain logic lives in `src/` (data, services, utils, content); UI in `app/`
  and `components/`. Keep them separated.
- Water-quality thresholds and their sources live in `src/data/parameters.ts`.
- All legal, disclaimer, and attribution copy lives in `src/content/legal.ts`.
  Bump `DISCLAIMER_VERSION` in `src/services/disclaimer.ts` when the substance of
  the safety disclaimer changes so users are re-prompted.

## Non-negotiables

- This app is informational only. Never present community data as official,
  never remove the safety disclaimers, and never imply the app determines
  whether water is safe.
- Functions that need "now" take `nowMs`/`nowIso` as a parameter where practical,
  so logic stays testable and pure.
