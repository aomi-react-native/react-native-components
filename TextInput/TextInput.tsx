import * as React from 'react';
import { Text, View, TextProps, Platform, StyleSheet } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';
import { BaseTextInput, BaseTextInputProps } from './BaseTextInput';

export interface TextInputProps extends BaseTextInputProps {
  before?: React.ReactNode;
  after?: React.ReactNode;

  size?: 'small' | 'medium';

  label?: React.ReactNode;
  help?: React.ReactNode;
  helpProps?: TextProps;
}

const INPUT_PROPS_KEYS = [
  'autoCapitalize',
  'autoCorrect',
  'autoFocus',
  'defaultValue',
  'editable',
  'keyboardType',
  'maxLength',
  'multiline',
  'onBlur',
  'onChange',
  'onChangeText',
  'onEndEditing',
  'onFocus',
  'onSubmitEditing',
  'placeholder',
  'placeholderTextColor',
  'secureTextEntry',
  'value',
  'blurOnSubmit',
  'clearButtonMode',
  'clearTextOnFocus',
  'enablesReturnKeyAutomatically',
  'keyboardAppearance',
  'numberOfLines',
  'onKeyPress',
  'returnKeyType',
  'selectTextOnFocus',
  'selectionState',
  'textAlign',
  'underlineColorAndroid',
  'name'
];

const CONTAINER_PADDING = {
  small: {
    paddingHorizontal: 14,
    paddingVertical: 10.5
  },
  medium: {
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  default: {
    paddingHorizontal: 14,
    paddingVertical: 18.5
  }
};

/**
 * list
 */
export const TextInput = React.forwardRef<
  any,
  React.PropsWithChildren<TextInputProps>
>(function TextInput(inProps, ref) {
  const {
    theme,
    before,
    after,
    label,
    help,
    helpProps,

    style,
    size,
    children,
    ...props
  } = useThemeProps({
    props: inProps,
    name: 'AMTextInput'
  });

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.white,
      borderRadius: 4,
      ...(CONTAINER_PADDING[size] || CONTAINER_PADDING.default)
    },
    inputWrapper: {
      flexDirection: 'row',
      flex: 1
    },
    input: {
      flex: 1,
      minHeight: 40,
      marginTop: Platform.select({
        ios: 2,
        android: 0
      })
    },
    textInput: {
      fontSize: 16,
      color: theme.colors.black,
      flex: 1
    }
  });

  let newInputProps = {};
  let newProps = { ...props };

  INPUT_PROPS_KEYS.forEach(key => {
    newInputProps[key] = props[key];
    newProps[key] && Reflect.deleteProperty(newProps, key);
  });

  let inputInstance;
  if (typeof children === 'string') {
    inputInstance = (
      <View style={[styles.input, { justifyContent: 'center' }]}>
        <Text numberOfLines={1} style={[styles.textInput]}>
          {children}
        </Text>
      </View>
    );
  } else if (typeof children !== 'undefined') {
    inputInstance = children;
  } else {
    inputInstance = (
      <View style={styles.inputWrapper}>
        {label}
        <BaseTextInput {...newInputProps} ref={ref} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {before}
      {inputInstance}
      {after}
    </View>
  );
});
