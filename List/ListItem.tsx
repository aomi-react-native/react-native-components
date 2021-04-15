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

  const childrenNumber = React.Children.count(children);
  // 当有多个子对象时 边距设置为6
  const margin = childrenNumber > 1 ? 6 : 4;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      marginTop: margin,
      marginBottom: margin,
      backgroundColor: theme.colors.white
    }
  });

  return (
    <View style={[styles.container, style]} ref={ref} {...props}>
      {children}
    </View>
  );
});
