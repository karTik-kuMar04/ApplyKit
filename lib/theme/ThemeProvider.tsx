import { useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './context';
import { darkColors, lightColors } from './tokens';
import type { ThemeMode } from '@/types';

const THEME_STORAGE_KEY = '@career_os/theme_mode';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeModeState(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemScheme]);

  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({ colors, isDark, themeMode, setThemeMode }),
    [colors, isDark, themeMode, setThemeMode]
  );

  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
