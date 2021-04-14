import { forwardRef } from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface TitleProps extends TextProps {}

/**
 * 标题
 */
export const Title = forwardRef<any, TitleProps>(function Title(inProps, ref) {
  const { theme, children, style, ...props } = useThemeProps({ props: inProps, name: 'AMTitle' });
  return (
    <Text ref={ref} style={[theme.Title, style]} {...props}>
      {children}
    </Text>
  );
});
