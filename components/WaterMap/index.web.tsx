/**
 * Web implementation of the water-body map, powered by MapLibre GL JS rendering
 * directly into the DOM. On web, a react-native-web `View` ref resolves to the
 * underlying DOM element, which MapLibre uses as its container. MapLibre needs
 * no access token.
 */
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  NJ_CENTER,
  mapStyle,
  markerColor,
  type WaterMapProps,
} from './shared';

function makeMarkerEl(color: string, ring: string): HTMLDivElement {
  const el = document.createElement('div');
  el.style.width = '18px';
  el.style.height = '18px';
  el.style.borderRadius = '50%';
  el.style.backgroundColor = color;
  el.style.border = `2px solid ${ring}`;
  el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.35)';
  el.style.cursor = 'pointer';
  return el;
}

export default function WaterMap({
  points,
  colorScheme,
  userLocation,
  onSelectPoint,
  focusPoint,
}: WaterMapProps) {
  const containerRef = useRef<View>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  // Keep the latest callback without re-creating markers on every render.
  const selectRef = useRef(onSelectPoint);
  selectRef.current = onSelectPoint;

  // Create the map once.
  useEffect(() => {
    const node = containerRef.current as unknown as HTMLElement | null;
    if (!node || mapRef.current) return;

    const map = new maplibregl.Map({
      container: node,
      style: mapStyle(colorScheme),
      center: focusPoint
        ? [focusPoint.longitude, focusPoint.latitude]
        : [NJ_CENTER.longitude, NJ_CENTER.latitude],
      zoom: focusPoint ? 12 : NJ_CENTER.zoom,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow the active color scheme.
  useEffect(() => {
    mapRef.current?.setStyle(mapStyle(colorScheme));
  }, [colorScheme]);

  // Sync markers whenever the points, focus, or scheme change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const ring = colorScheme === 'dark' ? '#0B1519' : '#FFFFFF';
    for (const p of points) {
      const el = makeMarkerEl(markerColor(p.status, colorScheme), ring);
      el.setAttribute('aria-label', `${p.name}, ${p.typeLabel}`);
      el.addEventListener('click', () => selectRef.current?.(p.id));
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    }

    if (userLocation) {
      const el = makeMarkerEl('#2F80ED', ring);
      el.style.width = '14px';
      el.style.height = '14px';
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [points, userLocation, colorScheme]);

  return <View ref={containerRef} style={styles.map} />;
}

const styles = StyleSheet.create({
  map: { flex: 1, minHeight: 200, overflow: 'hidden' },
});
