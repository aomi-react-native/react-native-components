import * as React from 'react';
import { useTheme } from './useTheme';
import nested from './nested';
import { ThemeContext } from './ThemeContext';

// To support composition of theme.
function mergeOuterLocalTheme(outerTheme, localTheme) {
  if (typeof localTheme === 'function') {
    const mergedTheme = localTheme(outerTheme);

    if (process.env.NODE_ENV !== 'production') {
      if (!mergedTheme) {
        console.error(['Material-UI: You should return an object from your theme function, i.e.', '<ThemeProvider theme={() => ({})} />'].join('\n'));
      }
    }

    return mergedTheme;
  }

  return { ...outerTheme, ...localTheme };
}

/**
 * This component takes a `theme` prop.
 * It makes the `theme` available down the React tree thanks to React context.
 * This component should preferably be used at **the root of your component tree**.
 */
export function ThemeProvider({ children, theme: localTheme }) {
  const outerTheme = useTheme();

  if (process.env.NODE_ENV !== 'production') {
    if (outerTheme === null && typeof localTheme === 'function') {
      console.error(
        [
          'Material-UI: You are providing a theme function prop to the ThemeProvider component:',
          '<ThemeProvider theme={outerTheme => outerTheme} />',
          '',
          'However, no outer theme is present.',
          'Make sure a theme is already injected higher in the React tree ' + 'or provide a theme object.'
        ].join('\n')
      );
    }
  }

  const theme = React.useMemo(() => {
    const output = outerTheme === null ? localTheme : mergeOuterLocalTheme(outerTheme, localTheme);

    if (output != null) {
      output[nested] = outerTheme !== null;
    }

    return output;
  }, [localTheme, outerTheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
