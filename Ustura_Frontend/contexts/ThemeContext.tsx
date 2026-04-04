import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/theme';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'ustura-theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function syncWebTheme(theme: Theme) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  const palette = Colors[theme];

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = palette.surface;
  document.documentElement.style.color = palette.onSurface;
  document.documentElement.style.transition = 'background-color 360ms ease, color 360ms ease';

  document.body.style.backgroundColor = palette.surface;
  document.body.style.color = palette.onSurface;
  document.body.style.transition = 'background-color 360ms ease, color 360ms ease';
}

function readStoredTheme(): Theme {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) {
      return stored;
    }
  }
  return 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, theme);
    syncWebTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
