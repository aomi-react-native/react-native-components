import { ObjectUtils } from '@aomi/utils/ObjectUtils';
import { Subtitle, Title } from '../Title/Title.theme';

export function createTheme(options = {}, ...args) {
  const { ...other } = options;

  let theme = ObjectUtils.deepmerge(
    {
      Title,
      Subtitle
    },
    other
  );

  theme = args.reduce((acc, argument) => ObjectUtils.deepmerge(acc, argument), theme);

  return theme;
}
