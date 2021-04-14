import { ObjectUtils } from '@aomi/utils/ObjectUtils';
import { subtitle, title } from '../Title/theme';
import { Theme, ThemeOptions } from './theme';

export function createTheme(options: ThemeOptions = {}, ...args): Theme {
  const { ...other } = options;

  let theme = ObjectUtils.deepmerge(
    {
      title,
      subtitle
    },
    other
  );

  theme = args.reduce(
    (acc, argument) => ObjectUtils.deepmerge(acc, argument),
    theme
  );

  return theme;
}
