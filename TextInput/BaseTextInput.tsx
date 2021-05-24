import * as React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface BaseTextInputProps extends TextInputProps {}

export const BaseTextInput = React.forwardRef<
  any,
  React.PropsWithChildren<BaseTextInputProps>
>(function BaseTextInput(inProps, ref) {
  const { theme, style, ...props } = useThemeProps({
    props: inProps,
    name: 'AMBaseTextInput'
  });

  const styles = StyleSheet.create({
    input: {
      fontSize: 16,
      color: theme.colors.black,
      flex: 1
    }
  });

  return <TextInput {...props} style={[styles.input, style]} ref={ref} />;
});
