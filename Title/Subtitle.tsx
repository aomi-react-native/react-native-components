import * as React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface SubtitleProps extends TextProps {}

/**
 * 子标题
 */
export const Subtitle = React.forwardRef<
  any,
  React.PropsWithChildren<SubtitleProps>
>(function Subtitle(inProps, ref) {
  const { theme, children, style, ...props } = useThemeProps({
    props: inProps,
    name: 'AMSubtitle'
  });
  const styles = StyleSheet.create({
    container: {
      ...theme.subtitle,
      fontWeight: '400',
      lineHeight: 18
    }
  });
  return (
    <Text ref={ref} style={[styles.container, style]} {...props}>
      {children}
    </Text>
  );
});
