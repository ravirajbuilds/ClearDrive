import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { DisclaimerProvider, useDisclaimer } from '@/hooks/useDisclaimer';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset + consent loading completes.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DisclaimerProvider>
        <RootLayoutNav />
      </DisclaimerProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { accepted } = useDisclaimer();
  const segments = useSegments();
  const router = useRouter();

  // Gate the app behind the safety disclaimer until it has been accepted.
  useEffect(() => {
    if (accepted === null) return; // still loading consent state
    SplashScreen.hideAsync().catch(() => {});

    const onOnboarding = segments[0] === 'onboarding';
    if (!accepted && !onOnboarding) {
      router.replace('/onboarding');
    } else if (accepted && onOnboarding) {
      router.replace('/(tabs)');
    }
  }, [accepted, segments, router]);

  // Hold on the splash until consent state is known to avoid a flash of the app.
  if (accepted === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="water-body/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen
          name="legal/[doc]"
          options={{ headerShown: true, presentation: 'card', title: '' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
