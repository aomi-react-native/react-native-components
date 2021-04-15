import * as React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface ListItemProps extends ViewProps {}

/**
 * list item
 */
export const ListItem = React.forwardRef<
  any,
  React.PropsWithChildren<ListItemProps>
>(function ListItem(inProps, ref) {
  const { theme, children, style, ...props } = useThemeProps({
    props: inProps,
    name: 'AMListItem'
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      backgroundColor: theme.colors.white
    }
  });

  return (
    <View style={[styles.container, style]} ref={ref} {...props}>
      {children}
    </View>
  );
});
