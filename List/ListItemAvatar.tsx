import * as React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface ListItemAvatarProps extends ViewProps {}

/**
 * list item avatar
 */
export const ListItemAvatar = React.forwardRef<
  any,
  React.PropsWithChildren<ListItemAvatarProps>
>(function ListItemAvatar(inProps, ref) {
  const { theme, children, style, ...props } = useThemeProps({
    props: inProps,
    name: 'AMListItemAvatar'
  });

  const styles = StyleSheet.create({
    container: {
      minWidth: 56,
      flexShrink: 0
    }
  });

  return (
    <View style={[styles.container, style]} ref={ref} {...props}>
      {children}
    </View>
  );
});
