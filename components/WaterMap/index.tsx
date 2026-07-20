/**
 * Native implementation of the water-body map. It loads MapLibre GL JS (the
 * open-source, tokenless fork of Mapbox GL JS) inside a WebView and renders the
 * exact same style and markers as the web build. Marker taps are relayed back to
 * React Native via `postMessage`.
 */
import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import {
  NJ_CENTER,
  mapStyle,
  markerColor,
  type WaterMapPoint,
  type WaterMapProps,
} from './shared';

const MAPLIBRE_VERSION = '5.24.0';

function pointFeatures(points: WaterMapPoint[], scheme: 'light' | 'dark') {
  return points.map((p) => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [p.longitude, p.latitude] },
    properties: { id: p.id, color: markerColor(p.status, scheme) },
  }));
}

function buildMapHtml(props: WaterMapProps): string {
  const { points, colorScheme, userLocation, focusPoint } = props;
  const ring = colorScheme === 'dark' ? '#0B1519' : '#FFFFFF';
  const center = focusPoint
    ? [focusPoint.longitude, focusPoint.latitude]
    : [NJ_CENTER.longitude, NJ_CENTER.latitude];
  const zoom = focusPoint ? 12 : NJ_CENTER.zoom;

  const geojson = JSON.stringify({
    type: 'FeatureCollection',
    features: pointFeatures(points, colorScheme),
  });
  const userJson = JSON.stringify(userLocation ?? null);
  const styleJson = JSON.stringify(mapStyle(colorScheme));

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link href="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css" rel="stylesheet" />
<script src="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js"></script>
<style>
  html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
  body { background: ${ring}; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = new maplibregl.Map({
    container: 'map',
    style: ${styleJson},
    center: ${JSON.stringify(center)},
    zoom: ${zoom}
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

  function post(msg) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg));
  }

  map.on('load', function () {
    map.addSource('bodies', { type: 'geojson', data: ${geojson} });
    map.addLayer({
      id: 'bodies-circles',
      type: 'circle',
      source: 'bodies',
      paint: {
        'circle-radius': 8,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 2,
        'circle-stroke-color': ${JSON.stringify(ring)}
      }
    });

    var user = ${userJson};
    if (user) {
      map.addSource('user', {
        type: 'geojson',
        data: { type: 'Point', coordinates: [user.longitude, user.latitude] }
      });
      map.addLayer({
        id: 'user-dot',
        type: 'circle',
        source: 'user',
        paint: {
          'circle-radius': 6,
          'circle-color': '#2F80ED',
          'circle-stroke-width': 2,
          'circle-stroke-color': ${JSON.stringify(ring)}
        }
      });
    }

    map.on('click', 'bodies-circles', function (e) {
      var f = e.features && e.features[0];
      if (f) post({ type: 'select', id: f.properties.id });
    });
    map.on('mouseenter', 'bodies-circles', function () { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'bodies-circles', function () { map.getCanvas().style.cursor = ''; });
    post({ type: 'ready' });
  });

  map.on('error', function (e) {
    post({ type: 'error', message: (e && e.error && e.error.message) || 'map error' });
  });
</script>
</body>
</html>`;
}

export default function WaterMap(props: WaterMapProps) {
  const { onSelectPoint } = props;
  const selectRef = useRef(onSelectPoint);
  selectRef.current = onSelectPoint;

  const html = useMemo(
    () => buildMapHtml(props),
    // Rebuild only when the rendered content changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.points, props.colorScheme, props.userLocation, props.focusPoint],
  );

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg?.type === 'select' && typeof msg.id === 'string') {
        selectRef.current?.(msg.id);
      }
    } catch {
      // Ignore malformed messages from the page.
    }
  };

  return (
    <View style={styles.fill}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        style={styles.fill}
        // A transparent background avoids a white flash before tiles load.
        backgroundColor="transparent"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, minHeight: 200 },
});
