import * as React from 'react';
import AbstractFormComponent from '../Form/AbstractFormComponent';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import commonStyle, { Colors, fontSize, separatorHeight } from '../styles';
import field from '../Form/field';

import Props from './Props';

// noinspection JSSuspiciousNameCombination
const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    borderWidth: separatorHeight,
    borderColor: Colors.separator,
    backgroundColor: Colors.white
  },
  icon: {
    ...commonStyle.center,
    width: 25
  },
  input: {
    flex: 1,
    minHeight: 40,
    marginTop: Platform.OS === 'ios' ? 2 : 0
  },
  textInput: {
    fontSize,
    color: Colors.fontColor
  },
  label: {
    justifyContent: 'center',
    marginRight: 10
  }
});

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

@field
export default class Input extends AbstractFormComponent<Props, any> {
  static defaultProps = {
    defaultValue: '',
    underlineColorAndroid: 'transparent',
    validate: true
  };

  state;

  // refs
  textInput;

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.defaultValue || ''
    };

    const { name, form } = this.props;
    name && form && form.putFormValue(name, this.props.defaultValue);
    this.putFormField();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.handleChangeText(nextProps.defaultValue);
    }
  }

  componentDidUpdate() {
    this.putFormField();
  }

  putFormField() {
    const { name, form } = this.props;
    if (name && form) {
      form.formFields[name] = this;
    }
  }

  getValue(): any {
    return this.state.value;
  }

  isValid(): boolean {
    let { validate, valid, pattern, required, name, form } = this.props;
    if (validate) {
      if (valid) {
        let result = valid(this.state.value);
        this.setFormFieldInfo(result);
        return result;
      }

      if (required) {
        if (this.state.value === '') {
          name && form && form.putMissField(name);
          return false;
        }
        name && form && form.deleteErrOrMissField(name);
      }

      if (pattern) {
        let result = pattern.test(this.state.value);
        this.setFormFieldInfo(result);
        return result;
      }
    }

    return true;
  }

  setFormFieldInfo(result) {
    const { name, form } = this.props;
    if (result) {
      name && form && form.deleteErrOrMissField(name);
    } else {
      name && form && form.putErrorField(name);
    }
  }

  handleChangeText(value) {
    this.setState({ value });
    const { onChangeText, name, form } = this.props;
    name && form && form.putFormValue(name, value);
    onChangeText && onChangeText(value);
  }

  focus() {
    this.textInput.focus();
  }

  render() {
    const { after, before, style, inputStyle, children, ...other } = this.props;

    let newInputProps = {};
    let newProps = { ...other };

    INPUT_PROPS_KEYS.forEach(key => {
      newInputProps[key] = this.props[key];
      newProps[key] && Reflect.deleteProperty(newProps, key);
    });

    let textInput;
    if (children) {
      textInput = (
        <View style={[styles.input, { justifyContent: 'center' }]}>
          <Text numberOfLines={1} style={[styles.textInput, inputStyle]}>
            {children}
          </Text>
        </View>
      );
    } else {
      textInput = (
        <TextInput
          {...newInputProps}
          onChangeText={this.handleChangeText}
          ref={textInput => (this.textInput = textInput)}
          style={[styles.input, inputStyle]}
        />
      );
    }

    return (
      <View {...newProps} style={[styles.container, style]}>
        {before}
        {textInput}
        {after}
      </View>
    );
  }
}
