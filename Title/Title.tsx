import * as React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface TitleProps extends TextProps {}

/**
 * 标题
 */
export const Title = React.forwardRef<any, React.PropsWithChildren<TitleProps>>(
  function Title(inProps, ref) {
    const { theme, children, style, ...props } = useThemeProps({
      props: inProps,
      name: 'AMTitle'
    });
    const styles = StyleSheet.create({
      container: {
        ...theme.title,
        fontWeight: '400',
        lineHeight: 22
      }
    });
    return (
      <Text ref={ref} style={[styles.container, style]} {...props}>
        {children}
      </Text>
    );
  }
);
