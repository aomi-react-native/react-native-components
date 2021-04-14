import { forwardRef } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface ListItemProps extends ViewProps {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

/**
 * list item
 */
export const ListItem = forwardRef<any, ListItemProps>(function ListItem(
  inProps,
  ref
) {
  const { theme, children, style, ...props } = useThemeProps({
    props: inProps,
    name: 'AMListItem'
  });

  return (
    <View style={[styles.container, style]} ref={ref} {...props}>
      {children}
    </View>
  );
});
