import * as React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface DividerProps extends ViewProps {
  /**
   * default horizontal
   */
  orientation?: 'horizontal' | 'vertical';

  variant?: 'fullWidth' | 'inset' | 'middle';
}

/**
 * Divider
 */
export const Divider = React.forwardRef<
  any,
  React.PropsWithChildren<DividerProps>
>(function Divider(inProps, ref) {
  const {
    theme,
    orientation = 'horizontal',
    variant,
    ...props
  } = useThemeProps({
    props: inProps,
    name: 'AMDivider'
  });
  const separator: any = {};
  switch (orientation) {
    case 'horizontal':
      separator.height = StyleSheet.hairlineWidth;
      break;
    case 'vertical':
      separator.width = StyleSheet.hairlineWidth;
      break;
  }

  const styles = StyleSheet.create({
    separator: {
      ...separator,
      backgroundColor: theme.colors.separator
    }
  });

  return <View style={styles.separator} />;
});
