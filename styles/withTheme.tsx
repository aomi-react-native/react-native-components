import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useTheme } from './useTheme';

export function withThemeCreator({ defaultTheme }: any = {}) {
  return Component => {
    if (process.env.NODE_ENV !== 'production') {
      if (Component === undefined) {
        throw new Error(['You are calling withTheme(Component) with an undefined component.', 'You may have forgotten to import it.'].join('\n'));
      }
    }

    const WithTheme = React.forwardRef(function WithTheme(props, ref) {
      const { ...other } = props;
      const theme = useTheme() || defaultTheme;
      return <Component theme={theme} ref={ref} {...other} />;
    });

    hoistNonReactStatics(WithTheme, Component);

    return WithTheme;
  };
}

// Provide the theme object as a prop to the input component.
// It's an alternative API to useTheme().
// We encourage the usage of useTheme() where possible.
export const withTheme = withThemeCreator();
