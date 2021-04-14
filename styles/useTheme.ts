import * as React from 'react';
import { ThemeContext } from './ThemeContext';
import { Theme } from './theme';

export function useTheme<T extends Theme>(): T {
  const theme: T = React.useContext<T>(ThemeContext);

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useDebugValue(theme);
  }

  return theme;
}
