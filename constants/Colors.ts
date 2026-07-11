/**
 * ClearDrive color system.
 *
 * The base keys (text, background, tint, tabIconDefault, tabIconSelected) are kept
 * for compatibility with the themed primitives in `components/Themed.tsx`. The
 * additional semantic keys drive cards, banners, borders, and status surfaces.
 *
 * Water-quality status colors are intentionally not a red/green-only scheme so the
 * app stays legible for the most common forms of color-vision deficiency; every
 * status is always paired with a text label in the UI.
 */

const brand = '#0A7EA4';
const brandDark = '#4CC2E8';

export default {
  light: {
    text: '#0B1B22',
    textMuted: '#5A6B72',
    textInverse: '#FFFFFF',
    background: '#F4F8FA',
    card: '#FFFFFF',
    cardAlt: '#EDF3F6',
    border: '#DCE5EA',
    tint: brand,
    tintSoft: '#E1F0F6',
    tabIconDefault: '#8A9AA1',
    tabIconSelected: brand,
    danger: '#C0392B',
    warning: '#B7791F',
    success: '#2E7D5B',
    overlay: 'rgba(11, 27, 34, 0.45)',
  },
  dark: {
    text: '#ECF3F6',
    textMuted: '#9DB0B8',
    textInverse: '#06222C',
    background: '#0B1519',
    card: '#12222A',
    cardAlt: '#0E1C22',
    border: '#22343C',
    tint: brandDark,
    tintSoft: '#123641',
    tabIconDefault: '#6E828B',
    tabIconSelected: brandDark,
    danger: '#F0736A',
    warning: '#E0B04A',
    success: '#5FC79A',
    overlay: 'rgba(0, 0, 0, 0.55)',
  },
};

/**
 * Water Quality Index status palette. Each status carries a foreground color for
 * text/icons and a soft background for chips and badges, in both themes.
 */
export const StatusColors = {
  light: {
    good: { fg: '#1B7A4B', bg: '#DCF3E7' },
    moderate: { fg: '#8A6D1F', bg: '#FBF0D2' },
    poor: { fg: '#B25A17', bg: '#FBE6D2' },
    unhealthy: { fg: '#B0362A', bg: '#FADBD7' },
    unknown: { fg: '#5A6B72', bg: '#E7EDF0' },
  },
  dark: {
    good: { fg: '#66D3A0', bg: '#123028' },
    moderate: { fg: '#E6C463', bg: '#2E2814' },
    poor: { fg: '#E9A063', bg: '#2E2114' },
    unhealthy: { fg: '#F0847B', bg: '#301A18' },
    unknown: { fg: '#9DB0B8', bg: '#1B2A31' },
  },
} as const;

export type ColorScheme = 'light' | 'dark';
