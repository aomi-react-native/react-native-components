import { useTheme } from './useTheme';
import defaultTheme from './defaultTheme';
import { getThemeProps } from './getThemeProps';

export function useThemeProps({ props, name }) {
  const contextTheme = useTheme() || defaultTheme;
  const more = getThemeProps({ theme: contextTheme, name, props });
  const theme = more.theme || contextTheme;

  return {
    theme,
    ...more
  };
}
