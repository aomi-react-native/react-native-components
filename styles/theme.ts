import { Subtitle, Title } from '../Title/theme';
import { Components } from './components';

export interface ThemeOptions {
  title?: Title;
  subtitle?: Subtitle;

  components?: Components;
}

export interface Theme {
  title: Title;
  subtitle: Subtitle;

  components?: Components;
}

export type ThemedProps<Theme, Name extends keyof any> = Theme extends {
  components: Record<Name, { defaultProps: infer Props }>;
}
  ? Props
  : {};

export interface ThemeWithProps<Components> {
  components?: {
    [K in keyof Components]: { defaultProps?: Partial<Components[K]> };
  };
}
