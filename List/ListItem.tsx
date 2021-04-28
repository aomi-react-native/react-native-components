import * as React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps
} from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export type ListItemProps<CProps = ViewProps> = CProps & {
  Component?: React.ElementType<CProps>;
  button?: boolean;
} & TouchableOpacityProps &
  TouchableNativeFeedbackProps;

/**
 * list item
 */
export const ListItem = React.forwardRef<
  any,
  React.PropsWithChildren<ListItemProps>
>(function ListItem(inProps, ref) {
  const { theme, children, style, button, Component, ...props } = useThemeProps(
    {
      props: inProps,
      name: 'AMListItem'
    }
  );

  let RootComponent;

  if (Component) {
    RootComponent = Component;
  } else if (button) {
    RootComponent = Platform.select<React.ElementType>({
      ios: TouchableOpacity,
      android: TouchableNativeFeedback
    });
  } else {
    RootComponent = View;
  }

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
    <RootComponent style={[styles.container, style]} ref={ref} {...props}>
      {children}
    </RootComponent>
  );
});
