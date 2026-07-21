/** Ambient module declarations for non-code imports. */

// MapLibre GL JS ships a stylesheet that the web map imports for its controls and
// canvas layout. Metro's web bundler handles the CSS; this keeps TypeScript happy.
declare module '*.css';
