import { useTheme } from './useTheme';
import defaultTheme from './defaultTheme';
import { getThemeProps } from './getThemeProps';

export interface ThemeWithProps {}

export type ThemedProps<Theme, Name extends keyof any> = Theme extends {
  components: Record<Name, { defaultProps: infer Props }>;
}
  ? Props
  : {};

export interface AdditionalThemeProps<Theme> {
  theme: Theme;
}

export function useThemeProps<
  Theme extends ThemeWithProps,
  Props,
  Name extends keyof any
>({
  props,
  name
}: {
  props: Props;
  name: Name;
}): Props & ThemedProps<Theme, Name> & AdditionalThemeProps<Theme> {
  const contextTheme = useTheme() || defaultTheme;
  const more = getThemeProps({ theme: contextTheme, name, props });
  const theme = more.theme || contextTheme;

  return {
    theme,
    ...more
  };
}
