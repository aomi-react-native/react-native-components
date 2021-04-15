import * as React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';
import { Subtitle, SubtitleProps, Title, TitleProps } from '../Title';

export interface ListItemTextProps extends ViewProps {
  primary?: React.ReactNode;
  primaryProps?: TitleProps;
  secondary?: React.ReactNode;
  secondaryProps?: SubtitleProps;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
    marginBottom: 4
  }
});

/**
 * list item
 */
export const ListItemText = React.forwardRef<
  any,
  React.PropsWithChildren<ListItemTextProps>
>(function ListItemText(inProps, ref) {
  const {
    primary,
    primaryProps,
    secondary,
    secondaryProps,

    theme,
    children,
    style,
    ...props
  } = useThemeProps({
    props: inProps,
    name: 'AMListItemText'
  });

  return (
    <View style={[styles.container, style]} ref={ref} {...props}>
      <Title {...primaryProps}>{primary}</Title>
      <Subtitle {...secondaryProps}>{secondary}</Subtitle>
      {children}
    </View>
  );
});
