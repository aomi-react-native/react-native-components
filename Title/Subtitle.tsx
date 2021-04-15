import * as React from 'react';
import { Text, TextProps } from 'react-native';
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
  return (
    <Text ref={ref} style={[theme.subtitle, style]} {...props}>
      {children}
    </Text>
  );
});
