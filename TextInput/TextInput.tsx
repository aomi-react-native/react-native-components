import * as React from 'react';
import {
  FlatList,
  FlatListProps,
  Text,
  View,
  TextInput as RNTextInput,
  TextProps
} from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface TextInputProps {
  before?: React.ReactNode;
  after?: React.ReactNode;

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

/**
 * list
 */
export const TextInput = React.forwardRef<
  any,
  React.PropsWithChildren<TextInputProps>
>(function TextInput(inProps, ref) {
  const { before, after, label, help, helpProps, ...props } = useThemeProps({
    props: inProps,
    name: 'AMTextInput'
  });

  let newInputProps = {};
  let newProps = { ...props };

  INPUT_PROPS_KEYS.forEach(key => {
    newInputProps[key] = this.props[key];
    newProps[key] && Reflect.deleteProperty(newProps, key);
  });

  return (
    <View>
      {before}
      <View>
        {label}
        <View>
          <RNTextInput {...newInputProps} />
        </View>
        <Text {...helpProps}>{help}</Text>
      </View>
      {after}
    </View>
  );
});
