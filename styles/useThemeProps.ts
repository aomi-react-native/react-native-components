import { useTheme } from './useTheme';
import defaultTheme from './defaultTheme';
import { getThemeProps } from './getThemeProps';
import { Theme, ThemedProps, ThemeWithProps } from './theme';

export interface AdditionalThemeProps {
  theme: Theme;
}

export function useThemeProps<
  Theme extends ThemeWithProps<any>,
  Props,
  Name extends keyof any
>({
  props,
  name
}: {
  props: Props;
  name: Name;
}): Props & ThemedProps<Theme, Name> & AdditionalThemeProps {
  const contextTheme = useTheme() || defaultTheme;

  const more = getThemeProps<Theme, Props, Name>({
    theme: contextTheme as any,
    name,
    props
  });

  return {
    theme: contextTheme,
    ...more
  };
}
